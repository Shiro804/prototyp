"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Hall", [
      {
        name: "Halle 1",
        description: "Storage area",
        location: "North Wing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Halle 2",
        description: "Assembly line",
        location: "East Wing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("Workstation", [
      {
        name: "Workstation 1",
        locationId: 1,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Workstation 2",
        locationId: 2,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("User", [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        passwordHash: "password123",
        workstationId: 1,
        role: "Operator",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        passwordHash: "password123",
        workstationId: 2,
        role: "Supervisor",
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("Machine", [
      {
        name: "Machine A",
        status: "Operational",
        locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Machine B",
        status: "Maintenance",
        locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("Material", [
      {
        type: "Raw",
        quantity: 100,
        locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "Finished",
        quantity: 50,
        locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("MaterialBatch", [
      {
        materialId: 1,
        batchNumber: "BATCH001",
        quantity: 100,
        locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        materialId: 2,
        batchNumber: "BATCH002",
        quantity: 50,
        locationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("TransportSystem", [
      {
        transportMethod: "Manual",
        materialId: 1,
        startLocationId: 1,
        endLocationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transportMethod: "Rollwagen",
        materialId: 2,
        startLocationId: 2,
        endLocationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("ProductionOrder", [
      {
        orderNumber: "ORD001",
        materialId: 1,
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderNumber: "ORD002",
        materialId: 2,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("ProcessStep", [
      {
        step: "Shipping",
        orderId: 1,
        machineId: 1,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        step: "Manufacturing",
        orderId: 2,
        machineId: 2,
        status: "InProgress",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("TaskQueue", [
      {
        userId: 1,
        processStepId: 1,
        status: "Assigned",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        processStepId: 2,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("WorkerAvailability", [
      {
        userId: 1,
        availabilityStatus: "Available",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        availabilityStatus: "Unavailable",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("GPSTracker", [
      {
        transportId: 1,
        latitude: 52.52,
        longitude: 13.405,
        timestamp: new Date(),
      },
      {
        transportId: 2,
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("Scanner", [
      { type: "Barcode", materialId: 1, scanTime: new Date() },
      { type: "RFID", materialId: 2, scanTime: new Date() },
    ]);

    await queryInterface.bulkInsert("Event", [
      {
        type: "Transport",
        entityId: 1,
        timestamp: new Date(),
        details: "TransportSystem initiated.",
      },
      {
        type: "Process",
        entityId: 2,
        timestamp: new Date(),
        details: "Process started.",
      },
    ]);

    await queryInterface.bulkInsert("ExceptionEvent", [
      {
        eventId: 1,
        severity: "Low",
        description: "Minor transport delay",
        createdAt: new Date(),
      },
      {
        eventId: 2,
        severity: "Critical",
        description: "Machine failure",
        createdAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("QualityCheck", [
      {
        materialId: 1,
        result: "Pass",
        checkTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        materialId: 2,
        result: "Fail",
        checkTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("Sensor", [
      {
        type: "Temperature",
        machineId: 1,
        value: 36.5,
        timestamp: new Date(),
      },
      { type: "Pressure", machineId: 2, value: 101.3, timestamp: new Date() },
    ]);

    await queryInterface.bulkInsert("ExternalEvent", [
      {
        sourceSystem: "External System A",
        eventType: "Alert",
        eventTime: new Date(),
        details: "External system alert",
      },
      {
        sourceSystem: "External System B",
        eventType: "Update",
        eventTime: new Date(),
        details: "External system update",
      },
    ]);

    await queryInterface.bulkInsert("PerformanceMetric", [
      {
        entityId: 1,
        metricName: "Efficiency",
        value: 95.5,
        timestamp: new Date(),
      },
      {
        entityId: 2,
        metricName: "Downtime",
        value: 120.0,
        timestamp: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("SimulationSetting", [
      {
        settingName: "MaxLoad",
        settingValue: "1000",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        settingName: "MinLoad",
        settingValue: "100",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert(
      "SimulationLog",
      [
        {
          eventType: "START",
          details: "Simulation started successfully.",
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventType: "MACHINE_CHECK",
          details: "Machine A is operational.",
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventType: "TRANSPORT",
          details: "Material batch 1 transported to workstation 3.",
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventType: "PROCESS_STEP_COMPLETION",
          details: "Process step 5 completed on machine B.",
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventType: "STOP",
          details: "Simulation stopped.",
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert("Inventory", [
      { materialId: 1, quantity: 100, locationId: 1, updatedAt: new Date() },
      { materialId: 2, quantity: 50, locationId: 2, updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize;

    await queryInterface.bulkDelete("TaskQueue", null, {});
    await queryInterface.bulkDelete("WorkerAvailability", null, {});
    await queryInterface.bulkDelete("ProcessStep", null, {});
    await queryInterface.bulkDelete("ProductionOrder", null, {});
    await queryInterface.bulkDelete("MaterialBatch", null, {});
    await queryInterface.bulkDelete("User", null, {});
    await queryInterface.bulkDelete("Workstation", null, {});
    await queryInterface.bulkDelete("GPSTracker", null, {});
    await queryInterface.bulkDelete("TransportSystem", null, {});
    await queryInterface.bulkDelete("Scanner", null, {});
    await queryInterface.bulkDelete("QualityCheck", null, {});
    await queryInterface.bulkDelete("Inventory", null, {});
    await queryInterface.bulkDelete("Material", null, {});
    await queryInterface.bulkDelete("Sensor", null, {});
    await queryInterface.bulkDelete("Machine", null, {});
    await queryInterface.bulkDelete("Event", null, {});
    await queryInterface.bulkDelete("ExceptionEvent", null, {});
    await queryInterface.bulkDelete("ExternalEvent", null, {});
    await queryInterface.bulkDelete("PerformanceMetric", null, {});
    await queryInterface.bulkDelete("SimulationSetting", null, {});
    await queryInterface.bulkDelete("SimulationLog", null, {});
    await queryInterface.bulkDelete("Hall", null, {});

    await sequelize.query('ALTER SEQUENCE "User_id_seq" RESTART WITH 1;');
    await sequelize.query(
      'ALTER SEQUENCE "Workstation_id_seq" RESTART WITH 1;'
    );
    await sequelize.query('ALTER SEQUENCE "Material_id_seq" RESTART WITH 1;');
    await sequelize.query(
      'ALTER SEQUENCE "MaterialBatch_id_seq" RESTART WITH 1;'
    );
    await sequelize.query(
      'ALTER SEQUENCE "TransportSystem_id_seq" RESTART WITH 1;'
    );
    await sequelize.query(
      'ALTER SEQUENCE "ProductionOrder_id_seq" RESTART WITH 1;'
    );
    await sequelize.query(
      'ALTER SEQUENCE "ProcessStep_id_seq" RESTART WITH 1;'
    );
    await sequelize.query('ALTER SEQUENCE "TaskQueue_id_seq" RESTART WITH 1;');
    await sequelize.query(
      'ALTER SEQUENCE "WorkerAvailability_id_seq" RESTART WITH 1;'
    );
    await sequelize.query('ALTER SEQUENCE "GPSTracker_id_seq" RESTART WITH 1;');
    await sequelize.query('ALTER SEQUENCE "Scanner_id_seq" RESTART WITH 1;');
    await sequelize.query('ALTER SEQUENCE "Event_id_seq" RESTART WITH 1;');
    await sequelize.query(
      'ALTER SEQUENCE "ExceptionEvent_id_seq" RESTART WITH 1;'
    );
    await sequelize.query(
      'ALTER SEQUENCE "QualityCheck_id_seq" RESTART WITH 1;'
    );
    await sequelize.query('ALTER SEQUENCE "Sensor_id_seq" RESTART WITH 1;');
    await sequelize.query(
      'ALTER SEQUENCE "ExternalEvent_id_seq" RESTART WITH 1;'
    );
    await sequelize.query(
      'ALTER SEQUENCE "PerformanceMetric_id_seq" RESTART WITH 1;'
    );
    await sequelize.query(
      'ALTER SEQUENCE "SimulationSetting_id_seq" RESTART WITH 1;'
    );
    await sequelize.query('ALTER SEQUENCE "Machine_id_seq" RESTART WITH 1;');
    await sequelize.query('ALTER SEQUENCE "Inventory_id_seq" RESTART WITH 1;');
    await sequelize.query(
      'ALTER SEQUENCE "SimulationLog_id_seq" RESTART WITH 1;'
    );
    await sequelize.query('ALTER SEQUENCE "Hall_id_seq" RESTART WITH 1;');
  },
};
