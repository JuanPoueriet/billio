import {
    Component, Input, computed, signal, inject, effect,
    ChangeDetectionStrategy, untracked, ElementRef, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartComponent, provideHighcharts, providePartialHighcharts } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

// Se importan los módulos base que siempre se usarán
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/accessibility';
import 'highcharts/modules/full-screen';

import {
    LucideAngularModule, Settings,
    Menu as MenuIcon, Maximize, FileDown, FileSpreadsheet, Printer, 
} from 'lucide-angular';

import { DashboardWidget, DashboardService, ChartType } from '../../../../core/services/dashboard';
import { BrandingService } from '../../../../core/services/branding';

// >>> ÚNICO CAMBIO NECESARIO PARA TRADUCCIÓN EN TS <<<
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type ExportingChart = Highcharts.Chart & {
    print: () => void;
    exportChart: (opts?: any, chartOpts?: Highcharts.Options) => void;
    downloadCSV: () => void;
    downloadXLS: () => void;
    fullscreen?: { toggle: () => void };
};

@Component({
    selector: 'app-cashflow-chart',
    templateUrl: './cashflow-chart.html',
    styleUrls: ['../widget-styles.scss', './cashflow-chart.scss'],
    providers: [
        providePartialHighcharts({
            modules: () => [import('highcharts/esm/modules/gantt')],
        }),
    ],
    imports: [HighchartsChartComponent, CommonModule, HighchartsChartComponent, LucideAngularModule, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashflowChart {
    @Input({ required: true }) widget!: DashboardWidget;
    @Input() isEditMode = false;

    private dashboardService = inject(DashboardService);
    private brandingService = inject(BrandingService);
    private hostEl = inject(ElementRef<HTMLElement>);

    // >>> ÚNICO CAMBIO NECESARIO PARA TRADUCCIÓN EN TS <<<
    private i18n = inject(TranslateService);

    // Íconos
    protected readonly SettingsIcon = Settings;
    protected readonly MenuIcon = MenuIcon;
    protected readonly FullscreenIcon = Maximize;
    protected readonly PrintIcon = Printer;
    protected readonly PngIcon = FileDown;
    protected readonly CsvIcon = FileSpreadsheet;

    // Estado UI
    isExportMenuOpen = signal(false);
    // Nota: Omitimos isSettingsOpen ya que este gráfico no tiene tipos alternativos lógicos.

    chartRef?: Highcharts.Chart;
    private get chart(): ExportingChart | undefined {
        return this.chartRef as unknown as ExportingChart;
    }

    // Effect para la actualización en tiempo real
    private chartUpdater = effect(() => {
        untracked(() => {
            if (this.chartRef) {
                this.chartRef.update(this.chartOptions(), true, true);
            }
        });
    });

    // Opciones reactivas
    chartOptions = computed<Highcharts.Options>(() => {
        const themeOptions = this.getThemeOptions();

        // >>> ÚNICO CAMBIO: cadenas pasan a i18n <<<
        const data = [
            { name: this.i18n.instant('CHARTS.CASHFLOW.X.OPENING_BALANCE'), y: 120000 },
            { name: this.i18n.instant('CHARTS.CASHFLOW.X.OPERATING_INCOME'), y: 230000 },
            { name: this.i18n.instant('CHARTS.CASHFLOW.X.COST_OF_GOODS_SOLD'), y: -110000 },
            { name: this.i18n.instant('CHARTS.CASHFLOW.X.OPERATING_EXPENSES'), y: -45000 },
            { name: this.i18n.instant('CHARTS.CASHFLOW.X.INVESTMENTS'), y: -20000 },
            { name: this.i18n.instant('CHARTS.CASHFLOW.X.ENDING_BALANCE'), isSum: true, color: 'var(--accent-primary)' }
        ];

        const baseOptions: Highcharts.Options = {
            chart: { type: 'waterfall', },
            title: {
                // >>> ÚNICO CAMBIO: i18n
                text: this.i18n.instant('CHARTS.CASHFLOW.TITLE'),
                style: { color: 'var(--text-primary)', fontSize: '16px', fontWeight: '600' }
            },
            xAxis: { type: 'category' },
            yAxis: {
                // >>> ÚNICO CAMBIO: i18n (se usa $ literal para no tocar tipos/servicios)
                title: { text: this.i18n.instant('CHARTS.CASHFLOW.Y_AXIS_TITLE', { currency: '$' }) }
            },
            legend: { enabled: false },
            series: [{
                // >>> ÚNICO CAMBIO: i18n
                name: this.i18n.instant('CHARTS.CASHFLOW.SERIES_NAME'),
                type: 'waterfall',
                upColor: '#4ade80',
                color: '#f87171',
                data,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return Highcharts.numberFormat(this.y! / 1000, 0, '.', ',') + 'k';
                    }
                }
            }],
            credits: { enabled: false },
            exporting: { enabled: false }
        };

        return Highcharts.merge(baseOptions, themeOptions);
    });

    private getThemeOptions(): Highcharts.Options {
        if (typeof window === 'undefined') return {};
        const bodyStyles = getComputedStyle(document.body);
        const textColor = bodyStyles.getPropertyValue('--text-primary').trim();
        const secondaryTextColor = bodyStyles.getPropertyValue('--text-secondary').trim();
        const bgColor = bodyStyles.getPropertyValue('--bg-layer-1').trim();
        const hoverBgColor = bodyStyles.getPropertyValue('--bg-hover').trim();
        const accentColor = bodyStyles.getPropertyValue('--accent-primary').trim();
        const borderRadiusMd = this.brandingService.settings().borderRadius;

        return {
            chart: { backgroundColor: 'transparent' },
            xAxis: { labels: { style: { color: secondaryTextColor } }, lineColor: 'var(--border-color)', tickColor: 'var(--border-color)' },
            yAxis: { title: { style: { color: secondaryTextColor } }, labels: { style: { color: secondaryTextColor } }, gridLineColor: 'var(--border-color)' },
            navigation: {
                buttonOptions: {
                    theme: {
                        stroke: secondaryTextColor, fill: 'transparent',
                        // states: { hover: { fill: hoverBgColor }, select: { fill: hoverBgColor } }
                    }
                },
                menuStyle: {
                    background: bgColor, border: `1px solid var(--border-color)`,
                    boxShadow: `0 8px 16px var(--shadow-color)`, borderRadius: borderRadiusMd, padding: '0.5rem'
                },
                menuItemStyle: {
                    color: textColor, fontSize: '13px', fontWeight: '500',
                    padding: '0.5rem 1rem', borderRadius: borderRadiusMd * 0.66
                },
                menuItemHoverStyle: { background: hoverBgColor, color: accentColor }
            },
        };
    }

    onChartInstance(chart: Highcharts.Chart) {
        this.chartRef = chart;
    }

    // Acciones de los menús
    closeMenus() {
        this.isExportMenuOpen.set(false);
    }

    toggleExportMenu(event: MouseEvent) {
        event.stopPropagation();
        this.isExportMenuOpen.update(o => !o);
    }

    // Acciones de exportación
    viewFullscreen(ev: MouseEvent) { ev.stopPropagation(); this.chart?.fullscreen?.toggle(); this.closeMenus(); }
    printChart(ev: MouseEvent) { ev.stopPropagation(); this.chart?.print(); this.closeMenus(); }
    downloadPNG(ev: MouseEvent) { ev.stopPropagation(); this.chart?.exportChart({ type: 'image/png' }); this.closeMenus(); }
    downloadJPEG(ev: MouseEvent) { ev.stopPropagation(); this.chart?.exportChart({ type: 'image/jpeg' }); this.closeMenus(); }
    downloadPDF(ev: MouseEvent) { ev.stopPropagation(); this.chart?.exportChart({ type: 'application/pdf' }); this.closeMenus(); }
    downloadSVG(ev: MouseEvent) { ev.stopPropagation(); this.chart?.exportChart({ type: 'image/svg+xml' }); this.closeMenus(); }
    downloadCSV(ev: MouseEvent) { ev.stopPropagation(); this.chart?.downloadCSV(); this.closeMenus(); }
    downloadXLS(ev: MouseEvent) { ev.stopPropagation(); this.chart?.downloadXLS(); this.closeMenus(); }

    // Cierra los menús al hacer clic fuera del componente
    @HostListener('document:mousedown', ['$event'])
    onDocumentClick(ev: MouseEvent) {
        if (!this.hostEl.nativeElement.contains(ev.target as Node)) {
            this.closeMenus();
        }
    }
}
