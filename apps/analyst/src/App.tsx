import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapLibreScenarioMap } from '@tmr/map-engine';
import { createMockTmrScenarioService, type CorridorLinkProperties, type ScenarioDataset, type TimePeriod, type TransportLayerId } from '@tmr/services-tmr';
import { Accordion, Button, Card, CheckboxGroup, Layout, RadioGroup, SelectInput } from '@tmr/ui-library';
import { formatNumber } from '@tmr/utils';

const service = createMockTmrScenarioService();

const layerLabels: Record<TransportLayerId, string> = {
  congestion: 'Congestion',
  publicTransport: 'Public transport',
  freight: 'Freight',
  accessibility: 'Accessibility'
};

const timePeriodOptions = [
  { id: 'period-am', label: 'AM peak', value: 'AM_PEAK' },
  { id: 'period-inter', label: 'Inter-peak', value: 'INTER_PEAK' },
  { id: 'period-pm', label: 'PM peak', value: 'PM_PEAK' }
] satisfies { id: string; label: string; value: TimePeriod }[];

const sidebar = {
  heading: { label: 'TMR analysis', route: '/' },
  defaultOpen: true,
  items: [
    { label: 'Scenario explorer', route: '/' },
    { label: 'Corridor insights', route: '#corridor-insights' },
    { label: 'Map workspace', route: '#map-workspace' }
  ]
};

export function App() {
  const [dataset, setDataset] = useState<ScenarioDataset | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState('bus-priority');
  const [activeLayers, setActiveLayers] = useState<TransportLayerId[]>(['congestion', 'publicTransport', 'freight']);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('AM_PEAK');
  const [selectedLink, setSelectedLink] = useState<CorridorLinkProperties | undefined>();

  useEffect(() => {
    let mounted = true;
    service.getScenarioDataset().then((nextDataset) => {
      if (mounted) setDataset(nextDataset);
    });
    return () => { mounted = false; };
  }, []);

  const toggleLayer = useCallback((layerId: string, checked: boolean) => {
    setActiveLayers((current) => checked ? [...new Set([...current, layerId as TransportLayerId])] : current.filter((item) => item !== layerId));
  }, []);

  const selectedScenario = useMemo(() => dataset?.scenarios.find((scenario) => scenario.id === selectedScenarioId), [dataset, selectedScenarioId]);
  const selectedKpis = selectedScenarioId && dataset ? dataset.kpisByScenario[selectedScenarioId] : undefined;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const scenarioOptions = dataset?.scenarios.map((scenario) => ({
    label: `${scenario.name} (${scenario.horizonYear})`,
    value: scenario.id
  })) ?? [];
  const layerOptions = (Object.keys(layerLabels) as TransportLayerId[]).map((layerId) => ({
    id: `layer-${layerId}`,
    label: layerLabels[layerId],
    value: layerId,
    checked: activeLayers.includes(layerId)
  }));

  if (!dataset || !selectedKpis || !selectedScenario) {
    return <main className="tmr-loading">Loading transport scenario dataset...</main>;
  }

  return (
    <Layout header={{ title: 'TMR Transport Scenario Explorer', baseUrl }} sidebar={sidebar}>
      <section className="qld__body">
        <section className="dcir__page-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-md-9">
                <h1 className="dcir__page-header--title">Transport scenario explorer</h1>
                <p className="dcir__page-header--description">
                  Compare corridor scenarios, time periods and operating layers against a shared network evidence base.
                </p>
              </div>
              <div className="col-xs-12 col-md-3 tmr-page-action">
                <Button variant="secondary" href="#map-workspace">View map</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="dcir__page-content">
          <div className="container-fluid">
            <div className="row qld__row-gap-component">
              <div className="col-xs-12 col-xl-4 qld__display-flex qld__flex-column qld__row-gap-component">
                <Accordion
                  defaultOpenAll
                  showToggleAll={false}
                  items={[
                    {
                      id: 'scenario-controls',
                      title: 'Scenario controls',
                      body: (
                        <div className="tmr-control-stack">
                          <SelectInput
                            id="scenario"
                            label="Scenario"
                            value={selectedScenarioId}
                            onChange={(value) => setSelectedScenarioId(String(value))}
                            options={scenarioOptions}
                            hint={selectedScenario.description}
                          />
                          <RadioGroup
                            id="time-period"
                            legend="Time period"
                            name="time-period"
                            selectedValue={timePeriod}
                            onChange={(value) => setTimePeriod(value as TimePeriod)}
                            options={timePeriodOptions}
                          />
                          <CheckboxGroup
                            id="map-layers"
                            legend="Map layers"
                            name="map-layers"
                            options={layerOptions}
                            onChange={toggleLayer}
                          />
                        </div>
                      )
                    }
                  ]}
                />

                <Card
                  variant="no-action"
                  title={selectedLink?.name ?? 'Link detail'}
                  description={
                    selectedLink
                      ? `${selectedLink.corridor} ${selectedLink.mode}: ${selectedLink.scenarioSpeedKph} km/h scenario speed, ${selectedLink.delayMinutes} min delay.`
                      : 'Select a corridor link on the map to inspect speed, volume, delay and reliability.'
                  }
                />
              </div>

              <div className="col-xs-12 col-xl-8 qld__display-flex qld__flex-column qld__row-gap-component">
                <section className="tmr-kpi-grid" aria-label="Scenario KPIs" id="corridor-insights">
                  <Card variant="no-action" title="Average delay" description={`${selectedKpis.averageDelayMinutes.toFixed(1)} min`} />
                  <Card variant="no-action" title="Corridor travel time" description={`${selectedKpis.corridorTravelTimeMinutes} min`} />
                  <Card variant="no-action" title="Population within 30 min" description={formatNumber(selectedKpis.populationWithinThirtyMinutes)} />
                  <Card variant="no-action" title="Freight reliability" description={`${selectedKpis.freightReliabilityPercent}%`} />
                </section>

                <section className="tmr-map-panel" id="map-workspace" aria-label="Scenario map workspace">
                  <MapLibreScenarioMap network={dataset.network} activeLayers={activeLayers} timePeriod={timePeriod} onLinkSelected={setSelectedLink} />
                </section>
              </div>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
}
