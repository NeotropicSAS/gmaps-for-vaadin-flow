/*
 *  Copyright 2010-2021 Neotropic SAS <contact@neotropic.co>.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       https://apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.neotropic.flow.component.googlemap;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import elemental.json.Json;
import elemental.json.JsonArray;
import elemental.json.JsonObject;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Component to display a heatmap.
 * @author Johny Andres Ortega Ruiz {@literal <johny.ortega@kuwaiba.org>}
 */
@Tag("heatmap-layer")
@JsModule("./heatmap-layer.js")
public class HeatmapLayer extends Component {
    
    public HeatmapLayer() {
    }
    
    public HeatmapLayer(List<LatLng> data) {
        setData(data);
    }
    
    public List<LatLng> getData() {
        Serializable data = getElement().getPropertyRaw(Constants.Property.DATA);
        return data instanceof JsonArray ? getData((JsonArray) data) : null;
    }
    
    public void setData(List<LatLng> data) {
        JsonArray array = getDataAsJson(data);
        if (array != null)
            getElement().setPropertyJson(Constants.Property.DATA, array);
        else
            getElement().setPropertyJson(Constants.Property.DATA, Json.createNull());
    }
    
    public boolean getDissipating() {
        return getElement().getProperty(Constants.Property.DISSIPATING, true);
    }
    
    public void setDissipating(boolean dissipating) {
        getElement().setProperty(Constants.Property.DISSIPATING, dissipating);
    }
    
    public double getRadius() {
        return getElement().getProperty(Constants.Property.RADIUS, 0);
    }
    
    public void setRadius(double radius) {
        getElement().setProperty(Constants.Property.RADIUS, radius);
    }
    
    private JsonArray getDataAsJson(List<LatLng> data) {
        if (data != null) {
            JsonArray array = Json.createArray();
            for (int i = 0; i < data.size(); i++) {
                JsonObject object = Json.createObject();
                object.put(Constants.Property.LAT, data.get(i).getLat());
                object.put(Constants.Property.LNG, data.get(i).getLng());
                array.set(i, object);
            }
            return array;
        }
        return null;
    }
    
    private List<LatLng> getData(JsonArray array) {
        if (array != null) {
            List<LatLng> data = new ArrayList();
            for (int i = 0; i < array.length(); i++) {
                JsonObject object = array.getObject(i);
                data.add(new LatLng(
                    object.getNumber(Constants.Property.LAT), 
                    object.getNumber(Constants.Property.LNG)
                ));
            }
            return data;
        }
        return null;
    }
}
