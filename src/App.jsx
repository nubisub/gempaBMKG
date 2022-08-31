import {useEffect, useRef, useState} from 'react'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './App.css'
const SOURCE = "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json"
import {Vector} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import {transform} from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Stroke from 'ol/style/Stroke';
import {Style} from "ol/style.js";
import CircleStyle from 'ol/style/Circle';

import Fill from 'ol/style/Fill';

function App() {
    const [data, setData] = useState([])
    const [map, setMap] = useState();
    const mapElement = useRef();
    const mapRef = useRef();
    mapRef.current = map;

    const center = transform([118.17353798950116,-1.4065452145022859], 'EPSG:4326', 'EPSG:3857');

    const buatMap =  (data) => {

        const coordinate = data.map(item => {
            return (item.Coordinates.split(","))
        });

        const newFeature = coordinate.map(item => {
            let Bujur = parseFloat(item[0])
            let Lintang = parseFloat(item[1])
            let center = transform([Lintang,Bujur], 'EPSG:4326', 'EPSG:3857');
            return new Feature({
                geometry: new Point(center),
                Magnitude: item.Magnitude,
            })
        });
        newFeature.forEach(item => {
            console.log(item)
            item.setStyle(new Style({
                image: new CircleStyle({
                    radius: 15,
                    fill: new Fill({
                        color: 'rgba(255, 0, 0, 0.3)'
                    }),
                    stroke: new Stroke({
                        color: 'rgba(255, 0, 0, 0.3)',
                        width: 1
                    })
                })
            }))
        },[])

        const initialMap = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: center,
                zoom: 5,
            }),
        });

        let layer = new VectorLayer({
            source: new Vector({
                features:newFeature,
            }),

        });
        initialMap.addLayer(layer);
        setMap(initialMap);
    }


    useEffect(() => {
        const getData = async () => {
            const response = await fetch(SOURCE)
            const dataJSON = await response.json()
            const dataGempa = dataJSON.Infogempa.gempa
            setData(dataGempa)
            buatMap(dataGempa)
        }

        getData();

    }, [])

  return (
      <div className="App">
      <div style={{height:'100vh',width:'100%'}} ref={mapElement} className="map-container" />
      </div>
    );
}

export default App
