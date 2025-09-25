/*
 *  Copyright 2010-2019 Neotropic SAS <contact@neotropic.co>.
 *  
 *  Licensed under the Apache License, Version 2.0 (the "License"); 
 *  you may not use this file except in compliance with the License. 
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software 
 *  distributed under the License is distributed on an "AS IS" BASIS, 
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 *  See the License for the specific language governing permissions and 
 *  limitations under the License.
 */
package com.neotropic.flow.component.googlemap;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.ComponentEventListener;
import com.vaadin.flow.component.Synchronize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.shared.Registration;
import elemental.json.Json;
import elemental.json.JsonArray;
import elemental.json.JsonObject;
import java.util.List;

/**
 *
 * @author Johny Andres Ortega Ruiz {@literal <johny.ortega@kuwaiba.org>}
 */
@Tag("google-map-polyline")
@JsModule("./gmaps-polyline.js")
public class GoogleMapPolyline extends Component {
    private List<LatLng> path;
    
    public GoogleMapPolyline() {
    }
    
    public boolean getDraggable() {
        return getElement().getProperty(Constants.Property.DRAGGABLE, Constants.Default.DRAGGABLE);
    }
    
    public void setDraggable(boolean draggable) {
        getElement().setProperty(Constants.Property.DRAGGABLE, draggable);
    }
    @Synchronize(property="editable", value="editable-changed")
    public boolean getEditable() {
        return getElement().getProperty(Constants.Property.EDITABLE, Constants.Default.EDITABLE);
    }
    
    public void setEditable(boolean editable) {
        getElement().setProperty(Constants.Property.EDITABLE, editable);
    }
    
    public String getStrokeColor() {
        return getElement().getProperty(Constants.Property.STROKE_COLOR, Constants.Default.STROKE_COLOR);
    }   
    
    public void setStrokeColor(String strokeColor) {
        getElement().setProperty(Constants.Property.STROKE_COLOR, strokeColor);
    }
    
    public double getStrokeOpacity() {
        return getElement().getProperty(Constants.Property.STROKE_OPACITY, Constants.Default.STROKE_OPACITY);
    }
    
    public void setStrokeOpacity(double strokeOpacity) {
        getElement().setProperty(Constants.Property.STROKE_OPACITY, strokeOpacity);
    }
    
    public double getStrokeWeight() {
        return getElement().getProperty(Constants.Property.STROKE_WEIGHT, Constants.Default.STROKE_WEIGHT);
    }
    
    public void setStrokeWeight(double strokeWeight) {
        getElement().setProperty(Constants.Property.STROKE_WEIGHT, strokeWeight);
    }
    
    public boolean getPolylineVisible() {
        return getElement().getProperty(Constants.Property.VISIBLE, Constants.Default.VISIBLE);
    }
    
    public void setPolylineVisible(boolean visible) {
        getElement().setProperty(Constants.Property.VISIBLE, visible);
    }
    /**
     * Indicates whether handles mouse events. Default value is true.
     * @return Indicates whether handles mouse events.
     */
    public boolean getClickable() {
        return getElement().getProperty(Constants.Property.CLICKABLE, true);
    }
    /**
     * Indicates whether handles mouse events.
     * @param clickable Indicates whether handles mouse events.
     */
    public void setClickable(boolean clickable) {
        getElement().setProperty(Constants.Property.CLICKABLE, clickable);
    }
    
    public double getZIndex() {
        return getElement().getProperty(Constants.Property.Z_INDEX, 0);
    }
    
    public void setZIndex(double zIndex) {
        getElement().setProperty(Constants.Property.Z_INDEX, zIndex);
    }
    
    @Synchronize(property="path", value="polyline-path-changed")
    public List<LatLng> getPath() {
        if (getElement().getPropertyRaw("path") instanceof JsonArray) {
            path.clear();
            JsonArray jsonCoordinates = (JsonArray) getElement().getPropertyRaw("path");
            for (int i = 0; i < jsonCoordinates.length(); i++) {
                JsonObject jsonCoordinate = jsonCoordinates.getObject(i);
                double lat = jsonCoordinate.getNumber("lat");
                double lng = jsonCoordinate.getNumber("lng");
                path.add(new LatLng(lat, lng));
            }
        }
        return path;
    }
    
    public void setPath(List<LatLng> path) {
        this.path = path;
        
        JsonArray jsonPath = Json.createArray();
        for (int i = 0; i < path.size(); i++) {
            JsonObject jsonCoordinate = Json.createObject();
            jsonCoordinate.put("lat", path.get(i).getLat());
            jsonCoordinate.put("lng", path.get(i).getLng());
            jsonPath.set(i, jsonCoordinate);
        }
        getElement().setPropertyJson(Constants.Property.PATH, jsonPath);
    }
    
    public String getLabel() {
        return getElement().getProperty(Constants.Property.LABEL, null);
    }
    
    public void setLabel(String label) {
        getElement().setProperty(Constants.Property.LABEL, label);
    }
    @Synchronize(property = "labelPosition", value = "label-position-changed")
    public LatLng getLabelPosition() {
        JsonObject labelPosition = (JsonObject) getElement().getPropertyRaw("labelPosition");
        return labelPosition != null ? new LatLng(labelPosition.getNumber("lat"), labelPosition.getNumber("lng")) : null;
    }
    @Synchronize(property = "labelAnimation", value = "label-animation-changed")
    public Animation getLabelAnimation() {
        return Animation.getAnimation(
            getElement().getProperty(Constants.Property.LABEL_ANIMATION, null)
        );
    }
    
    public void setLabelAnimation(Animation animation) {
        if (animation != null)
            getElement().setProperty(Constants.Property.LABEL_ANIMATION, animation.animation());
        else
            getElement().setPropertyJson(Constants.Property.LABEL_ANIMATION, Json.createNull());
    }
    
    public String getLabelIconUrl() {
        return getElement().getProperty(Constants.Property.LABEL_ICON_URL, null);
    }
    
    public void setLabelIconUrl(String labelIconUrl) {
        getElement().setProperty(Constants.Property.LABEL_ICON_URL, labelIconUrl);
    }
    
    public String getLabelColor() {
        return getElement().getProperty(Constants.Property.LABEL_COLOR, null);
    }
    
    public void setLabelColor(String labelColor) {
        getElement().setProperty(Constants.Property.LABEL_COLOR, labelColor);
    }
    
    public String getLabelFontSize() {
        return getElement().getProperty(Constants.Property.LABEL_FONT_SIZE, null);
    }
    
    public void setLabelFontSize(String labelFontSize) {
        getElement().setProperty(Constants.Property.LABEL_FONT_SIZE, labelFontSize);
    }
    
    public String getLabelClassName() {
        return getElement().getProperty(Constants.Property.LABEL_CLASS_NAME, null);
    }
    
    public void setLabelClassName(String labelClassName) {
        getElement().setProperty(Constants.Property.LABEL_CLASS_NAME, labelClassName);
    }
    
    public Registration addPolylineClickListener(ComponentEventListener<GoogleMapEvent.PolylineClickEvent> listener) {
        return addListener(GoogleMapEvent.PolylineClickEvent.class, listener);
    }
        
    public Registration addPolylineDblClickListener(ComponentEventListener<GoogleMapEvent.PolylineDblClickEvent> listener) {
        return addListener(GoogleMapEvent.PolylineDblClickEvent.class, listener);
    }
    
    public Registration addPolylineMouseOutListener(ComponentEventListener<GoogleMapEvent.PolylineMouseOutEvent> listener) {
        return addListener(GoogleMapEvent.PolylineMouseOutEvent.class, listener);
    }
    
    public Registration addPolylineMouseOverListener(ComponentEventListener<GoogleMapEvent.PolylineMouseOverEvent> listener) {
        return addListener(GoogleMapEvent.PolylineMouseOverEvent.class, listener);
    }
    
    public Registration addPolylineRightClickListener(ComponentEventListener<GoogleMapEvent.PolylineRightClickEvent> listener) {
        return addListener(GoogleMapEvent.PolylineRightClickEvent.class, listener);
    }
    
    public Registration addPolylinePathChangedListener(ComponentEventListener<GoogleMapEvent.PolylinePathChangedEvent> listener) {
        return addListener(GoogleMapEvent.PolylinePathChangedEvent.class, listener);
    }
    
    public Registration addVertexRightClickListener(ComponentEventListener<GoogleMapEvent.VertexRightClickEvent> listener) {
        return addListener(GoogleMapEvent.VertexRightClickEvent.class, listener);
    }
}
