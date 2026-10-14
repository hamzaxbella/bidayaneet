# Map geography provenance

`lib/morocco-boundary.json` uses longitude/latitude coordinates from Natural Earth’s public-domain 1:50m Admin 0 country dataset. Downloaded 2026-10-14 from the [Natural Earth vector repository](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson); [dataset documentation and public-domain terms](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/).

The app’s requested display extent includes Tanger, Laâyoune and Dakhla. The source geometries with `ADM0_A3` values `MAR` and `SAH` were combined by removing shared edges and stitching the remaining outer perimeter. The resulting 328-coordinate perimeter is stored as geographic GeoJSON, without SVG projection or invented coordinates.

MapLibre renders the interactive Mercator map, heat layer and selected coverage points. The raster basemap is Esri World Imagery and keeps its provider attribution. Sample coverage values remain labeled as demonstration data. When raster delivery fails, a status notice identifies that the local geographic coverage layer remains available.
