import { LitElement, html, nothing, type TemplateResult } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { toJpeg, toPng } from 'html-to-image'
import {
  mdiCheck,
  mdiContentCopy,
  mdiDeleteOutline,
  mdiDownload,
  mdiExportVariant,
  mdiImageOutline,
  mdiPlus,
  mdiRenameOutline,
  mdiTuneVariant,
} from '@mdi/js'
import '@home-assistant/webawesome/dist/components/button/button.js'
import '@home-assistant/webawesome/dist/styles/webawesome.css'
import '@home-assistant/webawesome/dist/styles/themes/default.css'
import { appStyles } from './app-styles'
import {
  DISPLAY_PROFILES,
  PALETTE_LABELS,
  getDisplayProfile,
  getPixelSize,
} from './data/display-profiles'
import {
  createId,
  createRegions,
  gridForOrientation,
  mergeRegions,
  regionContainsCell,
  rotateRegions,
  splitRegion,
} from './services/layout'
import {
  createProject,
  downloadJson,
  loadState,
  saveState,
} from './services/storage'
import type {
  CellCoordinate,
  GridRegion,
  Orientation,
  PaletteId,
  PersistedState,
  ScreenProject,
  WidgetOption,
} from './types'
import { WIDGETS, getWidgetDefinition, widgetStyles } from './widgets/registry'
import { renderIcon } from './widgets/shared'
import { sharedWidgetStyles } from './widgets/shared-styles'

const cloneProject = (project: ScreenProject): ScreenProject => {
  const now = new Date().toISOString()
  return {
    ...structuredClone(project),
    id: createId(),
    name: `${project.name} copy`,
    createdAt: now,
    updatedAt: now,
    regions: project.regions.map((region) => ({ ...structuredClone(region), id: createId() })),
  }
}

const downloadDataUrl = (dataUrl: string, filename: string): void => {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = filename
  anchor.click()
}

const regionLabel = (index: number): string => {
  let value = index + 1
  let label = ''
  while (value > 0) {
    value -= 1
    label = String.fromCharCode(65 + (value % 26)) + label
    value = Math.floor(value / 26)
  }
  return label
}

type EditorMode = 'layout' | 'widgets'

@customElement('odx-app')
export class OdxApp extends LitElement {
  @state() private store: PersistedState = loadState()
  @state() private selectedRegionId = ''
  @state() private mergeAnchor?: CellCoordinate
  @state() private mergeHover?: CellCoordinate
  @state() private toastMessage = ''
  @state() private exporting = false
  @state() private renameDraft = ''
  @state() private editorMode: EditorMode = 'widgets'
  @state() private layoutDraft?: ScreenProject

  @query('#display-screen') private displayScreen?: HTMLElement
  @query('#rename-dialog') private renameDialog?: HTMLDialogElement
  @query('#project-import') private projectImport?: HTMLInputElement

  private toastTimer?: number

  static styles = [appStyles, sharedWidgetStyles, ...widgetStyles]

  private get project(): ScreenProject {
    return this.store.projects.find((item) => item.id === this.store.activeProjectId) ?? this.store.projects[0]
  }

  private get display() {
    return getDisplayProfile(this.project.displayId)
  }

  private get canvasProject(): ScreenProject {
    return this.layoutDraft ?? this.project
  }

  private get canvasDisplay() {
    return getDisplayProfile(this.canvasProject.displayId)
  }

  private get selectedRegion(): GridRegion | undefined {
    return this.project.regions.find((region) => region.id === this.selectedRegionId)
  }

  private persist(store: PersistedState): void {
    this.store = store
    saveState(store)
  }

  private updateProject(updater: (project: ScreenProject) => ScreenProject): void {
    const projects = this.store.projects.map((project) =>
      project.id === this.store.activeProjectId
        ? { ...updater(project), updatedAt: new Date().toISOString() }
        : project,
    )
    this.persist({ ...this.store, projects })
  }

  private updateLayoutDraft(updater: (project: ScreenProject) => ScreenProject): void {
    if (!this.layoutDraft) return
    this.layoutDraft = updater(this.layoutDraft)
  }

  private openLayoutEditor(): void {
    this.layoutDraft = structuredClone(this.project)
    this.editorMode = 'layout'
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
  }

  private cancelLayoutEditor(): void {
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.mergeAnchor = undefined
    this.mergeHover = undefined
  }

  private applyLayoutEditor(): void {
    if (!this.layoutDraft) return
    const draft = this.layoutDraft
    this.updateProject(() => draft)
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.selectedRegionId = ''
    this.showToast('Device and layout updated')
  }

  private showToast(message: string): void {
    this.toastMessage = message
    if (this.toastTimer) window.clearTimeout(this.toastTimer)
    this.toastTimer = window.setTimeout(() => {
      this.toastMessage = ''
    }, 2600)
  }

  private selectProject(projectId: string): void {
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.persist({ ...this.store, activeProjectId: projectId })
  }

  private addProject(): void {
    const project = createProject(`Untitled display ${this.store.projects.length + 1}`)
    this.persist({ ...this.store, activeProjectId: project.id, projects: [...this.store.projects, project] })
    this.selectedRegionId = ''
    this.layoutDraft = structuredClone(project)
    this.editorMode = 'layout'
    this.showToast('Display created')
  }

  private duplicateProject(): void {
    const project = cloneProject(this.project)
    this.persist({ ...this.store, activeProjectId: project.id, projects: [...this.store.projects, project] })
    this.selectedRegionId = ''
    this.showToast('Display duplicated')
  }

  private deleteProject(): void {
    if (this.store.projects.length === 1) {
      this.showToast('At least one display must remain')
      return
    }
    const projects = this.store.projects.filter((project) => project.id !== this.project.id)
    this.persist({ ...this.store, activeProjectId: projects[0].id, projects })
    this.selectedRegionId = ''
    this.showToast('Display deleted')
  }

  private openRenameDialog(): void {
    this.renameDraft = this.project.name
    this.renameDialog?.showModal()
  }

  private saveProjectName(): void {
    const name = this.renameDraft.trim()
    if (!name) return
    this.updateProject((project) => ({ ...project, name }))
    this.renameDialog?.close()
    this.showToast('Name updated')
  }

  private changeDisplay(event: Event): void {
    const displayId = (event.currentTarget as HTMLSelectElement).value
    const profile = getDisplayProfile(displayId)
    const grid = gridForOrientation(profile, this.canvasProject.orientation)
    const sameGrid = grid.columns === this.canvasProject.grid.columns && grid.rows === this.canvasProject.grid.rows
    const widgets = this.canvasProject.regions.flatMap((region) => region.widget ? [region.widget] : [])
    const regions = sameGrid
      ? this.canvasProject.regions
      : createRegions(grid).map((region, index) => ({ ...region, widget: widgets[index] }))

    this.updateLayoutDraft((project) => ({
      ...project,
      displayId,
      palette: profile.palettes.includes(project.palette) ? project.palette : profile.defaultPalette,
      grid,
      regions,
    }))
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    if (!sameGrid) this.showToast('Grid adapted to the selected display')
  }

  private changePalette(event: Event): void {
    const palette = (event.currentTarget as HTMLSelectElement).value as PaletteId
    this.updateLayoutDraft((project) => ({ ...project, palette }))
  }

  private changeOrientation(orientation: Orientation): void {
    if (orientation === this.canvasProject.orientation) return
    const grid = gridForOrientation(this.canvasDisplay, orientation)
    const regions = rotateRegions(this.canvasProject.regions, this.canvasProject.grid, grid)
    this.updateLayoutDraft((project) => ({ ...project, orientation, grid, regions }))
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
  }

  private selectionContainsMergedRegion(first: CellCoordinate, second: CellCoordinate): boolean {
    const rowStart = Math.min(first.row, second.row)
    const rowEnd = Math.max(first.row, second.row)
    const columnStart = Math.min(first.column, second.column)
    const columnEnd = Math.max(first.column, second.column)
    return this.canvasProject.regions.some((region) => {
      if (region.rowSpan === 1 && region.columnSpan === 1) return false
      const regionRowEnd = region.row + region.rowSpan - 1
      const regionColumnEnd = region.column + region.columnSpan - 1
      return region.row <= rowEnd && regionRowEnd >= rowStart && region.column <= columnEnd && regionColumnEnd >= columnStart
    })
  }

  private selectMergeCell(cell: CellCoordinate): void {
    const occupyingRegion = this.canvasProject.regions.find((region) => regionContainsCell(region, cell))
    if (occupyingRegion && (occupyingRegion.rowSpan > 1 || occupyingRegion.columnSpan > 1)) return

    if (!this.mergeAnchor) {
      this.mergeAnchor = cell
      this.mergeHover = cell
      return
    }
    if (this.mergeAnchor.row === cell.row && this.mergeAnchor.column === cell.column) {
      this.mergeAnchor = undefined
      this.mergeHover = undefined
      return
    }
    if (this.selectionContainsMergedRegion(this.mergeAnchor, cell)) {
      this.mergeAnchor = undefined
      this.mergeHover = undefined
      this.showToast('Remove the existing region before drawing across it')
      return
    }
    const regions = mergeRegions(this.canvasProject.regions, this.mergeAnchor, cell)
    if (!regions) {
      this.mergeAnchor = undefined
      this.mergeHover = undefined
      this.showToast('The selected rectangle crosses an existing merged region')
      return
    }
    const previousIds = new Set(this.canvasProject.regions.map((region) => region.id))
    const mergedRegion = regions.find((region) => !previousIds.has(region.id))
    const existingMergedRegions = this.canvasProject.regions
      .filter((region) => region.rowSpan > 1 || region.columnSpan > 1)
      .sort((first, second) => first.row - second.row || first.column - second.column)
    const usedLabels = new Set(existingMergedRegions.map((region, index) => region.label ?? regionLabel(index)))
    let labelIndex = 0
    while (usedLabels.has(regionLabel(labelIndex))) labelIndex += 1
    const label = regionLabel(labelIndex)
    const labeledRegions = regions.map((region) => region.id === mergedRegion?.id ? { ...region, label } : region)
    this.updateLayoutDraft((project) => ({ ...project, regions: labeledRegions }))
    this.selectedRegionId = mergedRegion?.id ?? ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.showToast(`Region ${label} created`)
  }

  private splitSelectedRegion(regionId: string): void {
    const region = this.canvasProject.regions.find((item) => item.id === regionId)
    if (!region || (region.rowSpan === 1 && region.columnSpan === 1)) return
    this.updateLayoutDraft((project) => ({ ...project, regions: splitRegion(project.regions, regionId) }))
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.showToast('Region removed')
  }

  private assignWidget(widgetId: string): void {
    const definition = getWidgetDefinition(widgetId)
    if (!definition || !this.selectedRegion) return
    this.updateProject((project) => ({
      ...project,
      regions: project.regions.map((region) =>
        region.id === this.selectedRegionId
          ? { ...region, widget: { type: definition.id, version: definition.version, config: { ...definition.defaults } } }
          : region,
      ),
    }))
  }

  private removeWidget(): void {
    this.updateProject((project) => ({
      ...project,
      regions: project.regions.map((region) =>
        region.id === this.selectedRegionId ? { ...region, widget: undefined } : region,
      ),
    }))
  }

  private updateWidgetOption(option: WidgetOption, event: Event): void {
    const input = event.currentTarget as HTMLInputElement | HTMLSelectElement
    const value = option.type === 'toggle'
      ? (input as HTMLInputElement).checked
      : option.type === 'number'
        ? Number(input.value)
        : input.value
    this.updateProject((project) => ({
      ...project,
      regions: project.regions.map((region) => {
        if (region.id !== this.selectedRegionId || !region.widget) return region
        return { ...region, widget: { ...region.widget, config: { ...region.widget.config, [option.key]: value } } }
      }),
    }))
  }

  private async exportImage(format: 'png' | 'jpeg'): Promise<void> {
    if (!this.displayScreen || this.exporting) return
    this.exporting = true
    await this.updateComplete
    const { width, height } = getPixelSize(this.display, this.project.orientation)
    const options = {
      cacheBust: true,
      pixelRatio: 1,
      canvasWidth: width,
      canvasHeight: height,
      width,
      height,
      style: { width: `${width}px`, height: `${height}px` },
    }
    try {
      const dataUrl = format === 'png'
        ? await toPng(this.displayScreen, options)
        : await toJpeg(this.displayScreen, { ...options, quality: 0.94 })
      const slug = this.project.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-')
      downloadDataUrl(dataUrl, `${slug}.${format === 'jpeg' ? 'jpg' : 'png'}`)
      this.showToast(`${format === 'jpeg' ? 'JPG' : 'PNG'} exported at ${width}×${height}`)
    } catch {
      this.showToast('Image export failed')
    } finally {
      this.exporting = false
    }
  }

  private async importProject(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as ScreenProject
      if (parsed.schemaVersion !== 1 || !parsed.name || !parsed.displayId || !Array.isArray(parsed.regions)) throw new Error()
      const project = {
        ...parsed,
        id: createId(),
        name: `${parsed.name} imported`,
        regions: parsed.regions.map((region) => ({ ...region, id: createId() })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.persist({ ...this.store, activeProjectId: project.id, projects: [...this.store.projects, project] })
      this.showToast('Project imported')
    } catch {
      this.showToast('This file is not a valid ODX project')
    } finally {
      input.value = ''
    }
  }

  private renderProjectRail(): TemplateResult {
    return html`
      <aside class="project-rail" aria-label="Saved displays">
        <div class="rail-heading"><h2>Displays</h2><button class="text-button" @click=${this.addProject}>+ New</button></div>
        <div class="project-list">
          ${this.store.projects.map((project) => {
            const display = getDisplayProfile(project.displayId)
            const size = getPixelSize(display, project.orientation)
            return html`
              <button class="project-card ${project.id === this.project.id ? 'active' : ''}" @click=${() => this.selectProject(project.id)}>
                <span class="mini-screen" style=${styleMap({ '--mini-aspect': String(size.width / size.height) })}>${project.grid.columns}×${project.grid.rows}</span>
                <span class="project-card-copy"><strong>${project.name}</strong><span>${display.name}</span></span>
              </button>
            `
          })}
        </div>
        <div class="rail-footer">Saved locally in this browser.<br />No account or cloud connection.</div>
        <div class="rail-actions" aria-label="Project actions">
          <button class="rail-action" @click=${() => this.projectImport?.click()}>${renderIcon(mdiPlus)} Import</button>
          <button class="rail-action" @click=${() => downloadJson(this.project)}>${renderIcon(mdiExportVariant)} Project file</button>
          <button class="rail-action" @click=${() => this.exportImage('jpeg')}>${renderIcon(mdiDownload)} Export JPG</button>
          <button class="rail-action danger" @click=${this.deleteProject}>${renderIcon(mdiDeleteOutline)} Delete</button>
        </div>
      </aside>
    `
  }

  private renderToolbar(): TemplateResult {
    const project = this.canvasProject
    const display = this.canvasDisplay
    return html`
      <div class="device-toolbar layout-toolbar">
        <div class="control grow">
          <label for="device-model">Device model</label>
          <select id="device-model" .value=${display.id} @change=${this.changeDisplay}>
            <optgroup label="SOLUM · Newton Pro">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'Newton Pro').map((profile) => html`
                <option value=${profile.id} ?selected=${profile.id === display.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}${profile.freezer ? ' · mono' : ''}</option>
              `)}
            </optgroup>
            <optgroup label="OpenDisplay reference hardware">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'OpenDisplay').map((profile) => html`
                <option value=${profile.id} ?selected=${profile.id === display.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}</option>
              `)}
            </optgroup>
          </select>
        </div>
        <div class="control">
          <label for="palette">Palette</label>
          <select id="palette" .value=${project.palette} @change=${this.changePalette}>
            ${display.palettes.map((palette) => html`<option value=${palette} ?selected=${palette === project.palette}>${PALETTE_LABELS[palette]}</option>`)}
          </select>
        </div>
        <div class="control">
          <span class="field-label">Orientation</span>
          <div class="segment" role="group" aria-label="Display orientation">
            <button class=${project.orientation === 'landscape' ? 'active' : ''} @click=${() => this.changeOrientation('landscape')}>Landscape</button>
            <button class=${project.orientation === 'portrait' ? 'active' : ''} @click=${() => this.changeOrientation('portrait')}>Portrait</button>
          </div>
        </div>
        <span class="grid-badge">GRID ${project.grid.columns}×${project.grid.rows}</span>
      </div>
    `
  }

  private renderWidgetToolbar(): TemplateResult {
    const pixels = getPixelSize(this.display, this.project.orientation)
    return html`
      <div class="device-toolbar widget-toolbar">
        <div class="device-summary">
          <span class="step-kicker">Step 2 · Widgets</span>
          <strong>${this.display.name}</strong>
          <span>${pixels.width}×${pixels.height} · ${PALETTE_LABELS[this.project.palette]} · ${this.project.grid.columns}×${this.project.grid.rows} grid</span>
        </div>
        <wa-button size="s" appearance="outlined" @click=${this.openLayoutEditor}>${renderIcon(mdiTuneVariant)} Edit device & layout</wa-button>
      </div>
    `
  }

  private renderScreenRegion(region: GridRegion): TemplateResult {
    const definition = region.widget ? getWidgetDefinition(region.widget.type) : undefined
    const compact = region.columnSpan === 1 || region.rowSpan === 1
    const layoutMode = this.editorMode === 'layout'
    const isMerged = region.rowSpan > 1 || region.columnSpan > 1
    const mergedRegions = this.canvasProject.regions
      .filter((item) => item.rowSpan > 1 || item.columnSpan > 1)
      .sort((first, second) => first.row - second.row || first.column - second.column)
    const label = isMerged ? region.label ?? regionLabel(mergedRegions.findIndex((item) => item.id === region.id)) : `${region.column}.${region.row}`
    return html`
      <section
        class="screen-region ${layoutMode ? 'layout-region' : region.widget ? '' : 'empty'} ${!layoutMode && region.id === this.selectedRegionId ? 'selected' : ''}"
        style=${styleMap({ gridColumn: `${region.column} / span ${region.columnSpan}`, gridRow: `${region.row} / span ${region.rowSpan}` })}
        aria-label=${layoutMode ? isMerged ? `Region ${label}` : `Grid cell ${label}` : definition ? `${definition.name} region` : 'Empty region'}
        @click=${() => { if (!layoutMode) this.selectedRegionId = region.id }}
        @dblclick=${() => { if (layoutMode) this.splitSelectedRegion(region.id) }}
      >
        ${layoutMode
          ? isMerged
            ? html`<div class="layout-region-copy composed"><strong>${label}</strong><span>${region.columnSpan}×${region.rowSpan} region</span></div>`
            : nothing
          : definition && region.widget
            ? definition.render(region.widget.config, { compact, palette: this.project.palette })
            : html`<div class="empty-region-copy"><strong>Add widget</strong><span>${region.columnSpan}×${region.rowSpan} region</span></div>`}
      </section>
    `
  }

  private renderMergeLayer(): TemplateResult {
    if (this.editorMode !== 'layout') return html``
    const cells = Array.from({ length: this.canvasProject.grid.columns * this.canvasProject.grid.rows }, (_, index) => ({
      row: Math.floor(index / this.canvasProject.grid.columns) + 1,
      column: (index % this.canvasProject.grid.columns) + 1,
    }))
    const selectionEnd = this.mergeHover ?? this.mergeAnchor
    const selectionInvalid = Boolean(this.mergeAnchor && selectionEnd && this.selectionContainsMergedRegion(this.mergeAnchor, selectionEnd))
    return html`
      <div class="merge-layer active" aria-label="Region composition grid" @pointerleave=${() => { this.mergeHover = undefined }}>
        ${cells.map((cell) => {
          const occupyingRegion = this.canvasProject.regions.find((region) => regionContainsCell(region, cell))
          const occupied = Boolean(occupyingRegion && (occupyingRegion.rowSpan > 1 || occupyingRegion.columnSpan > 1))
          const inSelection = Boolean(this.mergeAnchor && selectionEnd &&
            cell.row >= Math.min(this.mergeAnchor.row, selectionEnd.row) &&
            cell.row <= Math.max(this.mergeAnchor.row, selectionEnd.row) &&
            cell.column >= Math.min(this.mergeAnchor.column, selectionEnd.column) &&
            cell.column <= Math.max(this.mergeAnchor.column, selectionEnd.column))
          return html`
            <button
              class="merge-cell ${occupied ? 'occupied' : ''} ${inSelection ? 'preview' : ''} ${selectionInvalid && inSelection ? 'invalid' : ''} ${this.mergeAnchor?.row === cell.row && this.mergeAnchor?.column === cell.column ? 'anchor' : ''}"
              aria-label=${occupied ? `Existing region at column ${cell.column}, row ${cell.row}; double-click to remove` : `Grid cell column ${cell.column}, row ${cell.row}`}
              @pointerenter=${() => { if (this.mergeAnchor) this.mergeHover = cell }}
              @click=${() => this.selectMergeCell(cell)}
              @dblclick=${(event: MouseEvent) => {
                event.preventDefault()
                event.stopPropagation()
                if (occupied && occupyingRegion) this.splitSelectedRegion(occupyingRegion.id)
              }}
            >${occupied ? nothing : `${cell.column}.${cell.row}`}</button>
          `
        })}
      </div>
    `
  }

  private renderCanvas(): TemplateResult {
    const project = this.canvasProject
    const display = this.canvasDisplay
    const pixels = getPixelSize(display, project.orientation)
    return html`
      <main class="canvas-area">
        <div class="canvas-stage" style=${styleMap({ '--screen-aspect': String(pixels.width / pixels.height) })}>
          <div class="screen-meta"><span>${display.manufacturer} · ${display.diagonal}″</span><code>${pixels.width} × ${pixels.height} px</code></div>
          <div class="preview-boundary">
            <div class="screen-bezel">
              <div
                id="display-screen"
                class="display-screen ${this.exporting ? 'exporting' : ''}"
                data-palette=${project.palette}
                style=${styleMap({ '--grid-columns': String(project.grid.columns), '--grid-rows': String(project.grid.rows) })}
              >
                ${project.regions.map((region) => this.renderScreenRegion(region))}
                ${this.renderMergeLayer()}
              </div>
            </div>
          </div>
          ${this.editorMode === 'layout'
            ? this.mergeAnchor
              ? html`<div class="merge-help"><strong>First corner selected.</strong> Move across the grid and click the opposite corner.</div>`
              : html`<div class="merge-help"><strong>Draw a region:</strong> Click two opposite corners. Double-click a region to remove it.</div>`
            : html`<div class="merge-help"><strong>Widget mode:</strong> Select a region to configure its content.</div>`}
        </div>
      </main>
    `
  }

  private renderOption(option: WidgetOption): TemplateResult {
    const value = this.selectedRegion?.widget?.config[option.key]
    if (option.type === 'toggle') return html`
      <div class="toggle-field"><label for=${`option-${option.key}`}>${option.label}</label><input id=${`option-${option.key}`} class="toggle" type="checkbox" .checked=${Boolean(value)} @change=${(event: Event) => this.updateWidgetOption(option, event)} /></div>
    `
    if (option.type === 'select') return html`
      <div class="field">
        <label class="field-label" for=${`option-${option.key}`}>${option.label}</label>
        <select id=${`option-${option.key}`} .value=${String(value ?? '')} @change=${(event: Event) => this.updateWidgetOption(option, event)}>
          ${option.options?.map((item) => html`<option value=${item.value}>${item.label}</option>`)}
        </select>
      </div>
    `
    return html`
      <div class="field">
        <label class="field-label" for=${`option-${option.key}`}>${option.label}</label>
        <input id=${`option-${option.key}`} type=${option.type} .value=${String(value ?? '')} min=${option.min ?? nothing} max=${option.max ?? nothing} step=${option.step ?? nothing} @change=${(event: Event) => this.updateWidgetOption(option, event)} />
      </div>
    `
  }

  private renderInspector(): TemplateResult {
    const region = this.selectedRegion
    if (!region) return html`
      <aside class="inspector"><div class="inspector-heading"><h2>Region settings</h2></div><div class="inspector-empty"><div><strong>Select a region</strong><p>Choose a region on the display to assign a widget and configure its data.</p></div></div></aside>
    `
    const definition = region.widget ? getWidgetDefinition(region.widget.type) : undefined
    return html`
      <aside class="inspector">
        <div class="inspector-heading"><h2>Region settings</h2><span class="region-address">R${region.row}:C${region.column} · ${region.columnSpan}×${region.rowSpan}</span></div>
        <div class="widget-picker">
          ${WIDGETS.map((widget) => html`
            <button class="widget-choice ${definition?.id === widget.id ? 'active' : ''}" @click=${() => this.assignWidget(widget.id)}>
              ${renderIcon(widget.icon)}<strong>${widget.name}</strong><span>${widget.description}</span>
            </button>
          `)}
        </div>
        ${definition
          ? html`<div class="option-form">${definition.options.map((option) => this.renderOption(option))}</div><div class="danger-zone"><wa-button size="s" variant="danger" appearance="outlined" @click=${this.removeWidget}>${renderIcon(mdiDeleteOutline)} Remove widget</wa-button></div>`
          : html`<div class="inspector-empty"><div><strong>Choose a widget</strong><p>Each widget brings its own data source and configuration fields.</p></div></div>`}
      </aside>
    `
  }

  private renderLayoutGuide(): TemplateResult {
    const project = this.canvasProject
    const pixels = getPixelSize(this.canvasDisplay, project.orientation)
    return html`
      <aside class="inspector layout-guide">
        <span class="step-kicker">Step 1 · Device & layout</span>
        <h2>Prepare the canvas</h2>
        <p>Choose the hardware and palette, then compose regions before assigning widgets.</p>
        <dl class="device-facts">
          <div><dt>Device</dt><dd>${this.canvasDisplay.name}</dd></div>
          <div><dt>Output</dt><dd>${pixels.width} × ${pixels.height} px</dd></div>
          <div><dt>Grid</dt><dd>${project.grid.columns} × ${project.grid.rows}</dd></div>
          <div><dt>Regions</dt><dd>${project.regions.length}</dd></div>
        </dl>
        <ol class="layout-instructions">
          <li>Click the first corner of a new region.</li>
          <li>Move across the grid and click the opposite corner.</li>
          <li>Double-click an existing region to remove it.</li>
        </ol>
        <div class="layout-guide-actions">
          <wa-button appearance="plain" @click=${this.cancelLayoutEditor}>Cancel</wa-button>
          <wa-button variant="brand" appearance="filled" @click=${this.applyLayoutEditor}>${renderIcon(mdiCheck)} Apply & choose widgets</wa-button>
        </div>
      </aside>
    `
  }

  private renderRenameDialog(): TemplateResult {
    return html`
      <dialog id="rename-dialog"><div class="dialog-body">
        <h2>Rename display</h2><p>Use a name that describes where this display will be installed.</p>
        <div class="field"><label class="field-label" for="display-name">Display name</label><input id="display-name" type="text" .value=${this.renameDraft} @input=${(event: Event) => { this.renameDraft = (event.currentTarget as HTMLInputElement).value }} @keydown=${(event: KeyboardEvent) => { if (event.key === 'Enter') this.saveProjectName() }} /></div>
        <div class="dialog-actions"><wa-button appearance="outlined" @click=${() => this.renameDialog?.close()}>Cancel</wa-button><wa-button variant="brand" @click=${this.saveProjectName}>Save name</wa-button></div>
      </div></dialog>
    `
  }

  render(): TemplateResult {
    return html`
      <div class="app-shell">
        <header class="topbar">
          <div class="brand"><span class="brand-mark">ODX</span><span class="brand-copy"><strong>OpenDisplay Studio</strong><span>E-paper composer</span></span></div>
          <div class="project-context">
            <div class="project-title"><strong>${this.project.name}</strong><span class="autosave-state">${this.editorMode === 'layout' ? 'Changes not applied' : 'Saved locally'}</span></div>
            <div class="workflow" aria-label="Editor workflow">
              <span class=${this.editorMode === 'layout' ? 'active' : 'complete'}><b>1</b> Device & layout</span>
              <i aria-hidden="true"></i>
              <span class=${this.editorMode === 'widgets' ? 'active' : ''}><b>2</b> Widgets</span>
            </div>
          </div>
          <div class="top-actions">
            ${this.editorMode === 'layout'
              ? html`<wa-button size="s" appearance="plain" @click=${this.cancelLayoutEditor}>Cancel</wa-button><wa-button size="s" variant="brand" appearance="filled" @click=${this.applyLayoutEditor}>${renderIcon(mdiCheck)} Apply layout</wa-button>`
              : html`
                  <wa-button class="secondary-action" size="s" appearance="outlined" @click=${this.openRenameDialog}>${renderIcon(mdiRenameOutline)} Rename</wa-button>
                  <wa-button class="secondary-action" size="s" appearance="outlined" @click=${this.duplicateProject}>${renderIcon(mdiContentCopy)} Duplicate</wa-button>
                  <wa-button size="s" variant="brand" @click=${() => this.exportImage('png')} ?loading=${this.exporting}>${renderIcon(mdiImageOutline)} Export PNG</wa-button>
                `}
          </div>
        </header>
        <div class="workspace">
          ${this.renderProjectRail()}
          <section class="editor">${this.editorMode === 'layout' ? this.renderToolbar() : this.renderWidgetToolbar()}${this.renderCanvas()}</section>
          ${this.editorMode === 'layout' ? this.renderLayoutGuide() : this.renderInspector()}
        </div>
      </div>
      <input id="project-import" type="file" accept="application/json,.json" hidden @change=${this.importProject} />
      ${this.renderRenameDialog()}
      ${this.toastMessage ? html`<div class="toast" role="status">${this.toastMessage}</div>` : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'odx-app': OdxApp
  }
}
