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
 * @author Johny Andres Ortega Ruiz {@literal <johny.ortega@kuwaiba.org>}
 */
class GoogleMapPolyline extends PolymerElement {
	static get is() {
		return Constants.googleMapPolyline;
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
			draggable: {
				type: Boolean,
				value: false,
				observer: '_draggableChanged'
			},
			editable:{
				type: Boolean,
				value: false,
				notify: true,
				observer: '_editableChanged'
			},
			/**
			 * All CSS3 colors (except for extended named colors)
			 */
			strokeColor: {
				type: String,
				value: '#FF0000',
				observer: '_strokeColorChanged'
			},
			/**
			 * Between 0.0 and 1.0
			 */
			strokeOpacity: {
				type: Number,
				value: 1.0,
				observer: '_strokeOpacityChanged'
			},
			/**
			 * In pixels
			 */
			strokeWeight: {
				type: Number,
				value: 2,
				observer: '_strokeWeightChanged'
			},
			visible: {
				type: Boolean,
				value: true,
				observer: '_visibleChanged'
			},
			path: {
				type: Array,
				observer: '_pathChanged'
			},
			/**
			 * Indicates whether handles mouse events.
			 */
			clickable: {
				type: Boolean,
				value: true,
				observer: '_clickableChanged'
			},
			zIndex: {
				type: Number,
				observer: '_zIndexChanged'
			},
			label: {
				type: String,
				observer: '_labelChanged'
			},
			labelPosition: {
				type: Object, // {lat: 0.0, lng: 0.0}
				readOnly: true, // this._setLabelPosition({lat: 0.0, lng: 0.0})
				notify: true //label-position-changed
			},
			labelAnimation: {
				type: String,
				notify: true,
				observer: '_labelAnimationChanged'
			},
			labelIconUrl: {
				type: String
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
	 * @return {google.maps.MVCObject} The google.maps.Polyline
	 */
	getMVCObject() {
		return this.polyline;
	}		
	added(map) {
		var _this = this;
		this.polyline = new google.maps.Polyline({
			draggable: this.draggable,
			editable: this.editable,
			map: map,
			strokeColor: this.strokeColor,
			strokeOpacity: this.strokeOpacity,
			strokeWeight: this.strokeWeight,
			visible: this.visible,
			clickable: this.clickable
		});
		if (this.zIndex)
			this._zIndexChanged(this.zIndex);
		
		this.polyline.addListener('click', event => {
			if (event.vertex)
				this.dispatchEvent(new CustomEvent('vertex-click', {detail: {vertex: event.vertex}}));
			else
				this.dispatchEvent(new CustomEvent('polyline-click'));
		});
		this.polyline.addListener('dblclick', event => {
			if (event.vertex)
				this.dispatchEvent(new CustomEvent('vertex-dbl-click', {detail: {vertex: event.vertex}}));
			else
				this.dispatchEvent(new CustomEvent('polyline-dbl-click'));
		});
		this.polyline.addListener('mouseout', event => {
			this.dispatchEvent(new CustomEvent('polyline-mouse-out'));
		});
		this.polyline.addListener('mouseover', event => {
			this.dispatchEvent(new CustomEvent('polyline-mouse-over'));
		});
		this.polyline.addListener('rightclick', event => {
			if (event.vertex)
				this.dispatchEvent(new CustomEvent('vertex-right-click', {detail: {vertex: event.vertex}}));
			else
				this.dispatchEvent(new CustomEvent('polyline-right-click'));
		});
		this._setPolylinePath(this.path);

		if (this.label)
			this._labelChanged(this.label);
	}

	_setPolylinePath(path) {
		if (path.length >= 2) {
			var _this = this;
			this.polyline.setPath(path);
			
			google.maps.event.addListener(this.polyline.getPath(), 'insert_at', function(index) {
				_this._updatePath();
			});
			google.maps.event.addListener(this.polyline.getPath(), 'remove_at', function(index, removed) {
				_this._updatePath();
			});
			google.maps.event.addListener(this.polyline.getPath(), 'set_at', function(index, previous) {
				_this._updatePath();
			});
			this._setMarkerLabelPosition();
		}
	}

	_updatePath() {
		var path = [];
		this.polyline.getPath().forEach(function(coordinate, index) {
			path.push({lat: coordinate.lat(), lng: coordinate.lng()});
		});
		this.path = path;
		this._setMarkerLabelPosition();
		this.dispatchEvent(new CustomEvent('polyline-path-changed'));
	}

	removed() {
		if (this.polyline !== undefined)
			this.polyline.setMap(null);
		if (this.markerLabel)
			this.markerLabel.setMap(null);
		if (this.markerAnimation)
			this.markerAnimation.setMap(null);
	}

	_draggableChanged(newValue, oldValue) {
		if (this.polyline !== undefined && 
			this.polyline.getDraggable() !== newValue) {
			this.polyline.setDraggable(newValue);
		}
	}

	_editableChanged(newValue, oldValue) {
		if (this.polyline !== undefined && 
			this.polyline.getEditable() !== newValue) {
			this.polyline.setEditable(newValue);
		}
	}

	_strokeColorChanged(newValue, oldValue) {
		if (this.polyline !== undefined)
			this.polyline.setOptions({strokeColor: newValue});
	}

	_strokeOpacityChanged(newValue, oldValue) {
		if (this.polyline !== undefined)
			this.polyline.setOptions({strokeOpacity: newValue});
	}

	_strokeWeightChanged(newValue, oldValue) {
		if (this.polyline !== undefined)
			this.polyline.setOptions({strokeWeight: newValue});
	}

	_visibleChanged(newValue, oldValue) {
		if (this.polyline !== undefined && 
			this.polyline.getVisible() != newValue) {
			this.polyline.setVisible(newValue);
			if (this.markerLabel) {
				this.markerLabel.setVisible(newValue);
			}
		}
	}

	_pathChanged(newValue, oldValue) {		
		if (this.polyline !== undefined && 
			this.polyline.getPath() !== undefined) { 
			if (this.polyline.getPath().getLength() === this.path.length) {
				var flag = false;
				for (var i = 0; i < this.path.length; i++) {
					if (this.polyline.getPath().getAt(i).lat() != this.path[i].lat ||  
						this.polyline.getPath().getAt(i).lng() != this.path[i].lng) {
						flag = true;
						break;
					}
				}
				if (flag) {
					this._setPolylinePath(newValue);
				}
			} else {
				this._setPolylinePath(newValue);
			}
		}
	}
	/**
	 * Indicates whether handles mouse events.
	 * @param {boolean} newValue 
	 */
	_clickableChanged(newValue) {
		if (this.polyline)
			this.polyline.setOptions({clickable: newValue});
	}
	/**
	 * @param {number} newValue
	 */
	_zIndexChanged(newValue) {
		if (this.polyline)
			this.polyline.setOptions({zIndex: newValue});
	}
	_labelChanged(newValue) {
		if (this.markerLabel) {
			this.markerLabel.setLabel(newValue ? 
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
	_setMarkerLabelPosition() {
		if (!this.markerLabel) {
			this.markerLabel = new google.maps.Marker({
				map: this.polyline.getMap(),
				clickable: false,
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					labelOrigin: new google.maps.Point(0, 20),
					strokeOpacity: 0
				}
			});

			this.markerAnimation = new google.maps.Marker({
				icon: this.labelIconUrl,
			});
			this.markerAnimation.addListener('click', event => this.labelAnimation = null);
		}
		var _path = this.polyline.getPath();
		var i = Math.floor(_path.getLength() / 2);

		var markerLabelPosition = null;
		if (_path.getLength() % 2 == 0) {
			markerLabelPosition = google.maps.geometry.spherical.interpolate(_path.getAt(i - 1), _path.getAt(i), 0.5);
		} else {
			markerLabelPosition = _path.getAt(i);
		}
		this._setLabelPosition({lat: markerLabelPosition.lat(), lng: markerLabelPosition.lng()});
		this.markerLabel.setPosition(markerLabelPosition);
		this.markerAnimation.setPosition(markerLabelPosition);
	}
	_labelAnimationChanged(newValue) {
		if (this.markerLabel) {
			if ('bounce' === newValue) {
				this.markerAnimation.setMap(this.polyline.getMap());
				this.markerAnimation.setAnimation(google.maps.Animation.BOUNCE);
			} else if ('drop' === newValue) {
				this.markerAnimation.setMap(this.polyline.getMap());
				this.markerAnimation.setAnimation(google.maps.Animation.DROP);
			} else {
				this.markerAnimation.setMap(null);
				this.markerAnimation.setAnimation(null);
			}
		}
	}
	_labelColorChanged(newValue) {
		if (this.markerLabel && this.markerLabel.getLabel() && this.markerLabel.getLabel().color !== newValue) {
			this.markerLabel.setLabel({
					text: this.label,
					className: this.labelClassName ? this.labelClassName : 'defaultLabel',
					color: newValue ? newValue : 'black',
					fontSize: this.labelFontSize ? this.labelFontSize : '14px'
			});
		}
	}
  _labelFontSizeChanged(newValue) {
    if (this.markerLabel && this.markerLabel.getLabel() && this.markerLabel.getLabel().fontSize !== newValue) {
			this.markerLabel.setLabel({
					text: this.label,
					className: this.labelClassName ? this.labelClassName : 'defaultLabel',
					color: this.labelColor ? this.labelColor : 'black',
					fontSize: newValue ? newValue : '14px'
			});
		}
  }
  _labelClassNameChanged(newValue) {
    if (this.markerLabel && this.markerLabel.getLabel() && this.markerLabel.getLabel().className !== newValue) {
			this.markerLabel.setLabel({
					text: this.label,
					className: newValue ? newValue : 'defaultLabel',
					color: this.labelColor ? this.labelColor : 'black',
					fontSize: this.labelFontSize ? this.labelFontSize : '14px'
			});
		}
  }
}

window.customElements.define(GoogleMapPolyline.is, GoogleMapPolyline);