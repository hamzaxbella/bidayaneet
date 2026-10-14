import type { Youth } from "./platform-types";
export type HeatCell = {
  name: string;
  province: string;
  lat: number;
  lng: number;
  neets: number;
  mediators: number;
  programs: number;
};
// Approximate cell centers (~2 km), without names, dossier IDs or precise coordinates.
export function aggregateLocations(people: Youth[]): HeatCell[] {
  const groups = new Map<string, { cell: HeatCell; actors: Set<string> }>();
  for (const p of people) {
    const g = p.data.location;
    if (
      !g?.consent ||
      !Number.isFinite(g.latitude) ||
      !Number.isFinite(g.longitude)
    )
      continue;
    const lat = (Math.floor(g.latitude / 0.02) + 0.5) * 0.02,
      lng = (Math.floor(g.longitude / 0.02) + 0.5) * 0.02;
    if (lat < 20 || lat > 36.7 || lng < -18 || lng > -0.5) continue;
    const id = lat.toFixed(2) + "," + lng.toFixed(2),
      label = p.data.commune || "Zone GPS";
    const item = groups.get(id) || {
      cell: {
        name: `${label} · zone ${groups.size + 1}`,
        province: label,
        lat: Number(lat.toFixed(2)),
        lng: Number(lng.toFixed(2)),
        neets: 0,
        mediators: 0,
        programs: 0,
      },
      actors: new Set<string>(),
    };
    item.cell.neets++;
    item.actors.add(p.mediator_id);
    item.cell.mediators = item.actors.size;
    groups.set(id, item);
  }
  return [...groups.values()].map((v) => v.cell);
}
export function aggregateCoverage(people:Youth[],programs:Record<string,unknown>[]):HeatCell[]{
 const cells=aggregateLocations(people),index=new Map(cells.map(c=>[c.lat.toFixed(2)+','+c.lng.toFixed(2),c]));
 for(const p of programs){if(p.published!==true)continue;const data=p.data as {commune?:string;location?:{latitude:number;longitude:number}},g=data?.location;if(!g||!Number.isFinite(g.latitude)||!Number.isFinite(g.longitude))continue;
  const lat=Number(((Math.floor(g.latitude/0.02)+0.5)*0.02).toFixed(2)),lng=Number(((Math.floor(g.longitude/0.02)+0.5)*0.02).toFixed(2));if(lat<20||lat>36.7||lng< -18||lng> -0.5)continue;
  const key=lat.toFixed(2)+','+lng.toFixed(2),cell=index.get(key)||{name:`${data.commune||'Zone GPS'} · zone ${index.size+1}`,province:data.commune||'Zone GPS',lat,lng,neets:0,mediators:0,programs:0};cell.programs++;index.set(key,cell);
 }
 return [...index.values()];
}
