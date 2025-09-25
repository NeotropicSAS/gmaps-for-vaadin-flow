/** 
@license
Copyright 2010-2021 Neotropic SAS <contact@neotropic.co>.

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
*/
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import * as Constants from './gmaps-constants.js';
/**
 * `heatmap-layer`
 * &lt;heatmap-layer&gt; is a web component to display a heatmap
 * @author Johny Andres Ortega Ruiz {@literal <johny.ortega@kuwaiba.org>}
 */
class HeatmapLayer extends PolymerElement {

  static get is() {
    return Constants.heatmapLayer;
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
    `; 
  }
  static get properties() {
    return {
      /**
       * [{'lat': 0.0, 'lng': 0.0}]
       */
      data: {
        type: Array,
        observer: '_dataChanged'
      },
      /**
       * Specifies whether heatmaps dissipate on zoom.
       */
      dissipating: {
        type: Boolean,
        observer: '_dissipatingChanged'
      },
      /**
       * The radius of influence for each data point, in pixels.
       */
      radius: {
        type: Number,
        observer: '_radiusChanged'
      }
    };
  }
  /**
   * @return {google.maps.MVCObject} The google.maps.visualization.HeatmapLayer
   */
  getMVCObject() {
    return this.heatmapLayer;
  }

  added(map) {
    this.heatmapLayer = new google.maps.visualization.HeatmapLayer({
      dissipating: this.dissipating,
      radius: this.radius
    });
    this.heatmapLayer.setMap(map);
    if (this.data) {
      var dataPoints = [];
      this.data.forEach(dataPoint => {
        dataPoints.push(
          new google.maps.LatLng(dataPoint.lat, dataPoint.lng)
        );
      });
      this.heatmapLayer.setData(dataPoints);
    }
    if (this.radius)
      this.heatmapLayer.setOptions({radius: this.radius});
    
    if (this.dissipating)
      this.heatmapLayer.setOptions({dissipating: this.dissipating});
  }

  removed() {
    if (this.heatmapLayer)
      this.heatmapLayer.setMap(null);
  }

  _dataChanged(newValue) {
    if (this.heatmapLayer && newValue) {
      var dataPoints = [];
      newValue.forEach(dataPoint => {
        dataPoints.push(
          new google.maps.LatLng(dataPoint.lat, dataPoint.lng)
        );
      });
      this.heatmapLayer.setData(dataPoints);
    }
  }

  _dissipatingChanged(newValue) {
    if (this.heatmapLayer)
      this.heatmapLayer.setOptions({dissipating: newValue});
  }

  _radiusChanged(newValue) {
    if (this.heatmapLayer)
      this.heatmapLayer.setOptions({radius: newValue});
  }
}

window.customElements.define(HeatmapLayer.is, HeatmapLayer);