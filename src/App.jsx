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
import {fromLonLat} from 'ol/proj';
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

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(SOURCE)
                .then(res => res.json())
                .then(res => res.Infogempa.gempa)
                .then(res => setData(res))
        }
        getData();
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
                features: [
                    new Feature({
                        geometry: new Point(center
                        ),
                    })
                ]
            })
        });
        initialMap.addLayer(layer);

        setMap(initialMap);
    }, [])



  return (
      <div className="App">
      <div style={{height:'100vh',width:'100%'}} ref={mapElement} className="map-container" />
      </div>
          )
}

export default App
