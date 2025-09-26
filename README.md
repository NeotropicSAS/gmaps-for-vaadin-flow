# GoogleMap Component for Vaadin Flow

Vaadin 24 Java integration of <google-map> web component

## License

Apache License 2.0

## Installing

Use the following maven dependency in your project, provided that the component has already been installed in your local repository.

<dependency>
    <groupId>com.neotropic.flow.component</groupId>
    <artifactId>gmaps-for-vaadin-flow-root</artifactId>
    <version>0.1.0</version>
    <type>jar</type>
</dependency>

## Basic use

GoogleMap googleMap = new GoogleMap("API_KEY");

## Starting the test/demo server:
1. Run `mvn jetty:run`.
2. Open http://localhost:8080 in the browser.

## Disclaimer

Google Maps and Vaadin trademarks are property of their respective owners. Neotropic SAS is not affiliated in any way to these companies. Use this component at your own risk.