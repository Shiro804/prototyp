import { Router } from "express";
import { getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';
import { getRoleById, createRole, updateRole, deleteRole } from '../controllers/roleController';
import { getHallById, createHall, updateHall, deleteHall } from '../controllers/hallController';
import { getMachineById, createMachine, updateMachine, deleteMachine } from '../controllers/machineController';
import { getMaterialById, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialInventoryController';
import { getMetricById, createMetric, updateMetric, deleteMetric } from '../controllers/metricController';
import { getProcessStepById, createProcessStep, updateProcessStep, deleteProcessStep } from '../controllers/processStepController';
import { getProductionOrderById, createProductionOrder, updateProductionOrder, deleteProductionOrder } from '../controllers/productionOrderController';
import { getQualityCheckById, createQualityCheck, updateQualityCheck, deleteQualityCheck } from '../controllers/qualityCheckController';
import { getResourceAssignmentById, createResourceAssignment, updateResourceAssignment, deleteResourceAssignment } from '../controllers/resourceAssignmentController';
import { getSensorById, createSensor, updateSensor, deleteSensor } from '../controllers/sensorController';
import { getSimulationLogById, createSimulationLog, updateSimulationLog, deleteSimulationLog } from '../controllers/simulationLogController';
import { getSimulationSettingById, createSimulationSetting, updateSimulationSetting, deleteSimulationSetting } from '../controllers/simulationSettingController';
import { getTrackingRecordById, createTrackingRecord, updateTrackingRecord, deleteTrackingRecord } from '../controllers/trackingSystemController';
import { getTransportSystemById, createTransportSystem, updateTransportSystem, deleteTransportSystem } from '../controllers/transportSystemController';
import { getWorkstationById, createWorkstation, updateWorkstation, deleteWorkstation } from '../controllers/workstationController';

const router = Router();

// Routes for User
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Routes for Role
router.get('/roles/:id', getRoleById);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

// Routes for Hall
router.get('/halls/:id', getHallById);
router.post('/halls', createHall);
router.put('/halls/:id', updateHall);
router.delete('/halls/:id', deleteHall);

// Routes for Machine
router.get('/machines/:id', getMachineById);
router.post('/machines', createMachine);
router.put('/machines/:id', updateMachine);
router.delete('/machines/:id', deleteMachine);

// Routes for MaterialInventory
router.get('/material-inventories/:id', getMaterialById);
router.post('/material-inventories', createMaterial);
router.put('/material-inventories/:id', updateMaterial);
router.delete('/material-inventories/:id', deleteMaterial);

// Routes for Metric
router.get('/metrics/:id', getMetricById);
router.post('/metrics', createMetric);
router.put('/metrics/:id', updateMetric);
router.delete('/metrics/:id', deleteMetric);

// Routes for ProcessStep
router.get('/process-steps/:id', getProcessStepById);
router.post('/process-steps', createProcessStep);
router.put('/process-steps/:id', updateProcessStep);
router.delete('/process-steps/:id', deleteProcessStep);

// Routes for ProductionOrder
router.get('/production-orders/:id', getProductionOrderById);
router.post('/production-orders', createProductionOrder);
router.put('/production-orders/:id', updateProductionOrder);
router.delete('/production-orders/:id', deleteProductionOrder);

// Routes for QualityCheck
router.get('/quality-checks/:id', getQualityCheckById);
router.post('/quality-checks', createQualityCheck);
router.put('/quality-checks/:id', updateQualityCheck);
router.delete('/quality-checks/:id', deleteQualityCheck);

// Routes for ResourceAssignment
router.get('/resource-assignments/:id', getResourceAssignmentById);
router.post('/resource-assignments', createResourceAssignment);
router.put('/resource-assignments/:id', updateResourceAssignment);
router.delete('/resource-assignments/:id', deleteResourceAssignment);

// Routes for Sensor
router.get('/sensors/:id', getSensorById);
router.post('/sensors', createSensor);
router.put('/sensors/:id', updateSensor);
router.delete('/sensors/:id', deleteSensor);

// Routes for SimulationLog
router.get('/simulation-logs/:id', getSimulationLogById);
router.post('/simulation-logs', createSimulationLog);
router.put('/simulation-logs/:id', updateSimulationLog);
router.delete('/simulation-logs/:id', deleteSimulationLog);

// Routes for SimulationSetting
router.get('/simulation-settings/:id', getSimulationSettingById);
router.post('/simulation-settings', createSimulationSetting);
router.put('/simulation-settings/:id', updateSimulationSetting);
router.delete('/simulation-settings/:id', deleteSimulationSetting);

// Routes for TrackingSystem
router.get('/tracking-systems/:id', getTrackingRecordById);
router.post('/tracking-systems', createTrackingRecord);
router.put('/tracking-systems/:id', updateTrackingRecord);
router.delete('/tracking-systems/:id', deleteTrackingRecord);

// Routes for TransportSystem
router.get('/transport-systems/:id', getTransportSystemById);
router.post('/transport-systems', createTransportSystem);
router.put('/transport-systems/:id', updateTransportSystem);
router.delete('/transport-systems/:id', deleteTransportSystem);

// Routes for Workstation
router.get('/workstations/:id', getWorkstationById);
router.post('/workstations', createWorkstation);
router.put('/workstations/:id', updateWorkstation);
router.delete('/workstations/:id', deleteWorkstation);

export default router;
