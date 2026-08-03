/** 
@license
Copyright 2010-2019 Neotropic SAS <contact@neotropic.co>.

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
 * `google-map-marker`
 * google-map-marker
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @author Johny Andres Ortega Ruiz {@literal <johny.ortega@kuwaiba.org>}
 */
class GoogleMapAdvancedMarker extends PolymerElement {
  static get is() {
    return Constants.googleMapAdvancedMarker;
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
       * {"url":"marker.png", "labelOrigin":{"x":20, "y":40}}
       */
      icon: {
        type: Object,
        value: {url: "marker.png", labelOrigin: {x: 20, y: 40}},
        observer: '_iconChanged'
      },
      lat: {
        type: Number,
        value: 2.4573831,
        observer: '_latChanged'
      },
      lng: {
        type: Number,
        value: -76.6699746,
        observer: '_lngChanged'        
      },
      title: {
        type: String,
        observer: '_titleChanged'
      },
      /**
       * {"color":"","fontFamily":"","fontSize":"","fontWeight":"","text":""}
       */
      label: {
        type: Object,
        observer: '_labelChanged'
      },
      
      /** 
       * Note:
       * For some reason cannot name the property as draggable
       * that is the reason behind the underscore
       */
      _draggable: {
        type: Boolean,
        value: false,
        observer: '__draggableChanged'
      },
      visible: {
        type: Boolean,
        value: true,
        observer: '_visibleChanged'
      },
      /**
       * @type {string}
       */
      animation: {
        type: String,
        observer: '_animationChanged'
      },
      /**
       * Indicates whether handles mouse events.
       */
      clickable: {
        type: Boolean,
        value: true,
        observer: '_clickableChanged'
      },
      labelColor: {
        type: String,
        value: 'black',
        observer: '_labelColorChanged'
      },
      labelFontSize: {
        type: String,
        value: '14px',
        observer: '_labelFontSizeChanged'
      },
      labelClassName: {
        type: String,
        value: 'defaultLabel',
        observer: '_labelClassNameChanged'
      }
    };
  }
  /**
   * @return {google.maps.MVCObject} The google.maps.Marker
   */
  getMVCObject() {
    return this.marker;
  }
  _getIcon() {
    if(this.icon.shape === "icon") {
      return {
        url: this.icon.url, 
        labelOrigin: this.icon.labelOrigin ? new google.maps.Point(this.icon.labelOrigin.x, this.icon.labelOrigin.y) : new google.maps.Point(20, 40)
      };
    }
    if(this.icon.shape === "circle") {
      const r = this.icon.radius || 16;
      return {
        path: `M ${-r},0 a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 -${2*r},0`,
        fillColor: this.icon.fillColor,
        fillOpacity: 1,
        strokeColor: this.icon.borderColor,
        strokeWeight: this.icon.borderWeight || 2,
        anchor: new google.maps.Point(0, 0),
        labelOrigin: this.icon.labelOrigin ? new google.maps.Point(this.icon.labelOrigin.x, this.icon.labelOrigin.y) : new google.maps.Point(0, 0)
      };
    }
    if(this.icon.shape === "square") {
      const r = this.icon.size / 2;
      return {
        path: `M ${-r} ${-2*r} L ${r} ${-2*r} L ${r} ${0} L ${-r} ${0} Z`,
        //path: `M ${-r} ${-r} L ${r} ${-r} L ${r} ${r} L ${-r} ${r} Z`,
        fillColor: this.icon.fillColor,
        fillOpacity: 1,
        strokeColor: this.icon.borderColor,
        strokeWeight: this.icon.borderWeight || 2,
        anchor: new google.maps.Point(0, 0),
        labelOrigin: this.icon.labelOrigin ? new google.maps.Point(this.icon.labelOrigin.x, this.icon.labelOrigin.y) : new google.maps.Point(20 - r, r/2)
      };   
    }
  }
  
  _buildContent() {
    const wrapper = document.createElement("div");
    wrapper.style.boxSizing = "content-box";
    wrapper.style.overflow = "visible"; 
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.textAlign = "center";
    wrapper.style.pointerEvents = "none";

    // ------------------------------
    // 1. FIGURE → circle, square or icon URL
    // ------------------------------
    let iconEl; // SVG or IMG
    let labelBackground = "blue";

    if (this.icon.shape === "circle") {
      const r = this.icon.radius || 16;
      const size = r * 2;

      wrapper.style.width = size + "px";
      wrapper.style.height = size + "px";
      
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", r);
      circle.setAttribute("cy", r);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", this.icon.fillColor || "red");
      circle.setAttribute("stroke", this.icon.borderColor || "black");
      circle.setAttribute("stroke-width", this.icon.borderWeight || 2);
      svg.appendChild(circle);
      iconEl = svg;
      labelBackground = "transparent";
    }

    else if (this.icon.shape === "square") {
      const size = this.icon.size || 30;
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", size);
      rect.setAttribute("height", size);
      rect.setAttribute("fill", this.icon.fillColor || "red");
      rect.setAttribute("stroke", this.icon.borderColor || "black");
      rect.setAttribute("stroke-width", this.icon.borderWeight || 2);
      svg.appendChild(rect);
      iconEl = svg;
    }

    else if (this.icon.shape === "icon") {
      const img = document.createElement("img");
      img.src = this.icon.url;
      img.style.width = this.icon.size ? this.icon.size + "px" : "32px";
      img.style.height = "auto";
      iconEl = img;
    }

    iconEl.style.pointerEvents = "none";
    wrapper.appendChild(iconEl);

    // ------------------------------
    // 2. HTML LABEL 
    // ------------------------------
    if (this.label) {
      const lbl = document.createElement("div");
      lbl.textContent = this.label.text || this.label;

      lbl.style.position = "absolute";
      lbl.style.display = "flex"; 
      lbl.style.alignItems = "center";
      lbl.style.justifyContent = "center";
      lbl.style.whiteSpace = "nowrap";
      lbl.style.fontSize = this.labelFontSize || "14px";
      lbl.style.color = this.labelColor || "black";
      lbl.style.fontWeight = this.label.fontWeight || "bold";
      lbl.style.pointerEvents = "none"; // para no bloquear clics
      lbl.className = this.labelClassName || "";

      wrapper.appendChild(lbl);

      const updateLabelPos = () => {
        if (this.icon.shape === "circle") {
          const r = this.icon.radius || 16;
          const size = r * 2;

          lbl.style.width = size + "px";
          lbl.style.height = size + "px";
          lbl.style.left = "50%";
          lbl.style.top = "50%";
          lbl.style.transform = "translate(-50%, -50%)";
          lbl.style.background = "transparent";
          lbl.style.borderRadius = "50%";

        } else {
          let h = 32;

          if (iconEl instanceof SVGElement) {
            h = iconEl.height.baseVal.value;
          } else if (iconEl instanceof HTMLImageElement) {
            h = iconEl.naturalHeight || iconEl.height || 32;
          }

          lbl.style.width = "auto";
          lbl.style.height = "auto";
          lbl.style.left = "50%";
          lbl.style.transform = "translateX(-50%)";
          lbl.style.top = h + "px";
          lbl.style.background = labelBackground;
          lbl.style.borderRadius = "4px";
          lbl.style.padding = "2px 4px";
        }
      };

      // SVG: ya tiene tamaño
      if (iconEl instanceof SVGElement) {
        updateLabelPos();
      }
      else if (iconEl instanceof HTMLImageElement) {
        if (iconEl.complete) {
          updateLabelPos();
        } else {
          iconEl.onload = updateLabelPos;
          iconEl.onerror = () => updateLabelPos();
        }
      }
    }

    return wrapper;
  }
  
  added(map) {
    var position = {lat: this.lat, lng: this.lng};

    this.marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: { lat: this.lat, lng: this.lng },
      title: this.title,
      content: this._buildContent(),
      gmpClickable: this.clickable
    });
    /*
    this.marker = new google.maps.Marker({
      position: position,
      map: map,
      title: this.title,
      icon: this._getIcon(),
      label: this.label ? 
        {
          text: this.label,
          className: this.labelClassName ? this.labelClassName : 'defaultLabel',
          color: this.labelColor ? this.labelColor : 'black',
          fontSize: this.labelFontSize ? this.labelFontSize : '14px'
        } 
        : this.label,
      draggable: this._draggable,
      visible: this.visible,
      animation: this.animation,
      clickable: this.clickable
    });
    */
    var _this = this;
    this.marker.addListener('click', function(event) {
      _this.dispatchEvent(new CustomEvent('advanced-marker-click'));
    });
    this.marker.addListener('dblclick', function(event) {
      _this.dispatchEvent(new CustomEvent('advanced-marker-dbl-click'));
    });
    this.marker.addListener('dragend', function(event) {
      _this.dispatchEvent(new CustomEvent('advanced-marker-drag-end', 
        {detail: {lat: event.latLng.lat(), lng: event.latLng.lng()}}));
    });
    this.marker.addListener('dragstart', function(event) {
      _this.dispatchEvent(new CustomEvent('advanced-marker-drag-start', 
        {detail: {lat: event.latLng.lat(), lng: event.latLng.lng()}}));
    });
    this.marker.addListener('mouseout', function(event) {
      _this.dispatchEvent(new CustomEvent('advanced-marker-mouse-out'));
    });
    this.marker.addListener('mouseover', function(event) {
      _this.dispatchEvent(new CustomEvent('advanced-marker-mouse-over'));
    });
    this.marker.addListener('position_changed', function() {
      _this.lat = _this.marker.getPosition().lat();
      _this.lng = _this.marker.getPosition().lng();
      _this.dispatchEvent(new CustomEvent('advanced-marker-position-changed'));
    });
    this.marker.addListener('rightclick', function(event) {
      _this.dispatchEvent(new CustomEvent('advanced-marker-right-click'));
    });
    this.marker.addListener('animation_changed', () => 
      this.dispatchEvent(new CustomEvent('marker-animation-changed'))
    );
    /*
    Events: 
    animation_changed, 
    *click, 
    clickable_changed, 
    cursor_changed, 
    *dblclick, 
    drag, 
    dragend, 
    draggable_changed, 
    dragstart, 
    flat_changed, 
    icon_changed, 
    mousedown, 
    mouseout, 
    mouseover, 
    mouseup, 
    position_changed, 
    *rightclick, 
    shape_changed, 
    title_changed, 
    visible_changed, 
    zindex_changed
    */
  }

  removed() {
    if (this.marker !== undefined)
      this.marker.setMap(null);
  }

  _iconChanged(newValue, oldValue) {
    if (this.marker !== undefined) {
      var icon = this._getIcon(newValue);
      if (this.marker.getIcon() !== icon) {
        this.marker.setIcon(icon);
      }
    }
  }

  _latChanged(newValue, oldValue) {
    if (this.marker !== undefined &&
      this.marker.getPosition().lat() !== newValue) {
      this.marker.setPosition({lat: newValue, lng: this.marker.getPosition().lng()});
    }
  }

  _lngChanged(newValue, oldValue) {
    if (this.marker !== undefined && 
      this.marker.getPosition().lng() !== newValue) {
      this.marker.setPosition({lat: this.marker.getPosition().lat(), lng: newValue});
    }
  }

  _titleChanged(newValue, oldValue) {
    if (this.marker !== undefined && 
      this.marker.getTitle() !== newValue) {
        this.marker.setTitle(newValue);
      }
  }

  _labelChanged(newValue, oldValue) {
    if (this.marker !== undefined && 
      this.marker.getLabel() !== newValue) {
        this.marker.setLabel(newValue ? 
          {
            text: newValue,
            className: this.labelClassName ? this.labelClassName : 'defaultLabel',
            color: this.labelColor ? this.labelColor : 'black',
            fontSize: this.labelFontSize ? this.labelFontSize : '14px'
          } 
          : newValue
        );
    }
  }

  __draggableChanged(newValue, oldValue) {
    if (this.marker !== undefined && 
      this.marker.getDraggable() !== newValue) {
        this.marker.setDraggable(newValue);
    }
  }

  _visibleChanged(newValue, oldValue) {
    if (this.marker !== undefined && 
      this.marker.getVisible() !== newValue) {
        this.marker.setVisible(newValue);
    }
  }
  /**
   * 
   * @param {string} newValue 
   * @param {string} oldValue 
   */
  _animationChanged(newValue, oldValue) {
    if (this.marker) {
      if ('bounce' === newValue)
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
      else if ('drop' === newValue)
        this.marker.setAnimation(google.maps.Animation.DROP);
      else
        this.marker.setAnimation(null);
    }
  }
  /**
   * Indicates whether handles mouse events.
   * 
   * @param {boolean} newValue 
   */
  _clickableChanged(newValue) {
    if (this.marker)
      this.marker.setOptions({clickable: newValue});
  }
  _labelColorChanged(newValue) {
    if (this.marker && this.marker.getLabel() && this.marker.getLabel().color && this.marker.getLabel().color !== newValue) {
      this.marker.setLabel({
        text: this.label,
        className: this.labelClassName ? this.labelClassName : 'defaultLabel',
        color: newValue ? newValue : 'black',
        fontSize: this.labelFontSize ? this.labelFontSize : '14px'
      });
    }
  }
  _labelFontSizeChanged(newValue) {
    if (this.marker && this.marker.getLabel() && this.marker.getLabel().fontSize && this.marker.getLabel().fontSize !== newValue) {
      this.marker.setLabel({
        text: this.label,
        className: this.labelClassName ? this.labelClassName : 'defaultLabel',
        color: this.labelColor ? this.labelColor : 'black',
        fontSize: newValue ? newValue : '14px'
      });
    }
  }
  _labelClassNameChanged(newValue) {
    if (this.marker && this.marker.getLabel() && this.marker.getLabel().className && this.marker.getLabel().className !== newValue) {
      this.marker.setLabel({
        text: this.label,
        className: newValue ? newValue : 'defaultLabel',
        color: this.labelColor ? this.labelColor : 'black',
        fontSize: this.labelFontSize ? this.labelFontSize : '14px'
      });
    }
  }
}

window.customElements.define(GoogleMapAdvancedMarker.is, GoogleMapAdvancedMarker);