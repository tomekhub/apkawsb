export interface Geom {
    type: string;
    crs: { type: string, properties: {name: string}, coordinates: number[] };
}
export interface AirStation {
    pm10: number;
    pm25: number;
    temperature: number;
    humidity: number;
    id_air: number;
    measurer: {geom: Geom};
    distance: number;
}
