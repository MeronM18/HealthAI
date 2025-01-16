module com.example.healthai {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.healthai to javafx.fxml;
    exports com.example.healthai;
}