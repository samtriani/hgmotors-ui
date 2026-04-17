import type { Car, Client, Sale, WorkshopItem, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Guillermo Uribe', email: 'director@hg.com', role: 'DIRECTOR', avatar: 'GU' },
  { id: 'u2', name: 'Carlos Mendoza', email: 'gerente@hg.com', role: 'GERENTE', avatar: 'CM' },
  { id: 'u3', name: 'Alejandro Ruiz', email: 'vendedor@hg.com', role: 'VENDEDOR', avatar: 'AR' },
  { id: 'u4', name: 'Miguel Torres', email: 'taller@hg.com', role: 'TALLER', avatar: 'MT' },
  { id: 'u5', name: 'Sandra López', email: 'admin@hg.com', role: 'ADMIN', avatar: 'SL' },
  { id: 'u6', name: 'Patricia Ríos', email: 'patricia@hg.com', role: 'VENDEDOR', avatar: 'PR' },
  { id: 'u7', name: 'Omar Castro', email: 'omar@hg.com', role: 'VENDEDOR', avatar: 'OC' },
];

export const MOCK_PASSWORDS: Record<string, string> = {
  'director@hg.com': 'hg2026',
  'gerente@hg.com': 'hg2026',
  'vendedor@hg.com': 'hg2026',
  'taller@hg.com': 'hg2026',
  'admin@hg.com': 'hg2026',
};

export const MOCK_CARS: Car[] = [
  {
    id: 'c1', brand: 'Honda', model: 'Civic', version: 'TOURING AUT', year: 2024,
    price: 515000, km: 23000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T120145.834.png',
    color: 'Blanco Platino', vin: '800739', entryDate: '2026-04-15',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Honda Civic Touring edición especial, full equipo, asientos de piel, pantalla 9", CarPlay.'
  },
  {
    id: 'c2', brand: 'Honda', model: 'HR-V', version: 'UNIQUE AUT', year: 2023,
    price: 419000, km: 41000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T101052.741.png',
    color: 'Gris Lunar', vin: '920341', entryDate: '2026-04-14',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Honda HR-V Unique, edición especial, llantas de aleación, sensores de reversa, cámara.'
  },
  {
    id: 'c3', brand: 'Kia', model: 'Seltos', version: 'SXL AUT', year: 2024,
    price: 440000, km: 23000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-14T131210.859.png',
    color: 'Rojo Passion', vin: '137515', entryDate: '2026-04-10',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Kia Seltos SXL nivel más alto, techo corredizo, pantalla 10.25", asientos ventilados.'
  },
  {
    id: 'c4', brand: 'Kia', model: 'K3', version: 'EX PACK AUT', year: 2024,
    price: 359000, km: 39000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-11T131559.901.png',
    color: 'Negro Ebony', vin: '284721', entryDate: '2026-04-05',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Kia K3 EX Pack, un auto elegante y equipado con todas las comodidades necesarias.'
  },
  {
    id: 'c5', brand: 'Hyundai', model: 'Grand i10', version: 'STD', year: 2023,
    price: 255000, km: 37000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T102630.867.png',
    color: 'Azul Ocean', vin: '374892', entryDate: '2026-03-28',
    fuelType: 'Gasolina', transmission: 'Manual',
    description: 'Hyundai Grand i10 económico y eficiente. Perfecto para ciudad.'
  },
  {
    id: 'c6', brand: 'Chevrolet', model: 'Captiva', version: 'LT', year: 2022,
    price: 310000, km: 50000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T125716.449-1.png',
    color: 'Blanco Summit', vin: '483920', entryDate: '2026-04-12',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Chevrolet Captiva 7 asientos, pantalla táctil, cámara trasera, control de crucero.'
  },
  {
    id: 'c7', brand: 'Toyota', model: 'Corolla', version: 'LE AUT', year: 2023,
    price: 395000, km: 28000, status: 'EN_TALLER',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-08T105744.681.png',
    color: 'Blanco Perla', vin: '591034', entryDate: '2026-04-10',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Toyota Corolla en preparación. Un clásico confiable.'
  },
  {
    id: 'c8', brand: 'Nissan', model: 'Kicks', version: 'ADVANCE AUT', year: 2023,
    price: 375000, km: 32000, status: 'RESERVADO',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/03/Diseno-sin-titulo-2026-03-09T153043.763.png',
    color: 'Naranja Monarch', vin: '602847', entryDate: '2026-03-15',
    fuelType: 'Gasolina', transmission: 'CVT',
    description: 'Nissan Kicks Advance, tecnología ProPILOT, cámara 360°.'
  },
  {
    id: 'c9', brand: 'Volkswagen', model: 'Taos', version: 'COMFORTLINE', year: 2022,
    price: 425000, km: 55000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/03/Diseno-sin-titulo-2026-03-31T131527.751.png',
    color: 'Gris Plata', vin: '713958', entryDate: '2026-02-20',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'VW Taos con los extras alemanes que te encantan.'
  },
  {
    id: 'c10', brand: 'Mazda', model: 'CX-5', version: 'GRAND TOURING', year: 2023,
    price: 580000, km: 18000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-09T095201.540.png',
    color: 'Rojo Soul', vin: '824061', entryDate: '2026-02-05',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Mazda CX-5 Grand Touring, el SUV premium con diseño KODO. Techo panorámico, Bose, i-ACTIVSENSE.'
  },
  {
    id: 'c11', brand: 'Ford', model: 'Bronco Sport', version: 'BIG BEND', year: 2022,
    price: 490000, km: 44000, status: 'VENDIDO',
    image: 'https://hgmotors.mx/wp-content/uploads/2025/12/Diseno-sin-titulo-2025-12-10T114236.050.png',
    color: 'Verde Area 51', vin: '935172', entryDate: '2026-01-15',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Ford Bronco Sport para la aventura.'
  },
  {
    id: 'c12', brand: 'Jeep', model: 'Compass', version: 'LATITUDE', year: 2023,
    price: 510000, km: 27000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/01/Diseno-sin-titulo-2026-01-29T104824.367.png',
    color: 'Azul Hydro', vin: '046283', entryDate: '2026-03-01',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Jeep Compass Latitude 4x2. Aventura y confort en uno.'
  },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'cl1', name: 'Roberto Sánchez Vega', phone: '6699123456', email: 'roberto@gmail.com', status: 'NEGOCIACION', assignedTo: 'u3', interestedIn: 'c3', budget: 450000, notes: 'Busca SUV familiar, tiene 2 hijos. Muy interesado en Kia Seltos.', createdAt: '2026-04-10', source: 'Instagram' },
  { id: 'cl2', name: 'Laura Medina Torres', phone: '6691234567', email: 'laura.medina@gmail.com', status: 'SEGUIMIENTO', assignedTo: 'u3', interestedIn: 'c1', budget: 520000, notes: 'Quiere financiamiento. Primera compra de auto nuevo.', createdAt: '2026-04-12', source: 'WhatsApp' },
  { id: 'cl3', name: 'Carlos Figueroa López', phone: '6692345678', email: 'cfigueroa@hotmail.com', status: 'NUEVO', assignedTo: 'u3', budget: 300000, notes: 'Viene referido por Roberto Sánchez. Busca sedan económico.', createdAt: '2026-04-14', source: 'Referido' },
  { id: 'cl4', name: 'Ana Patricia Guerrero', phone: '6693456789', email: 'anapg@outlook.com', status: 'CERRADO', assignedTo: 'u3', interestedIn: 'c11', budget: 490000, notes: 'Compró Bronco Sport. Muy satisfecha.', createdAt: '2026-03-20', source: 'Facebook' },
  { id: 'cl5', name: 'Jorge Alberto Pinto', phone: '6694567890', email: 'jorgepinto@gmail.com', status: 'NEGOCIACION', assignedTo: 'u3', interestedIn: 'c10', budget: 600000, notes: 'Empresario. Busca algo premium. Tiene trade-in de Mazda 3.', createdAt: '2026-04-08', source: 'Página web' },
  { id: 'cl6', name: 'Valeria Romero Cruz', phone: '6695678901', email: 'vale.romero@gmail.com', status: 'SEGUIMIENTO', assignedTo: 'u3', interestedIn: 'c5', budget: 270000, notes: 'Estudiante universitaria. Primer auto. Papá ayuda con el enganche.', createdAt: '2026-04-13', source: 'Instagram' },
  { id: 'cl7', name: 'Fernando Ochoa Ríos', phone: '6696789012', email: 'fochoa@empresa.com', status: 'PERDIDO', assignedTo: 'u3', budget: 400000, notes: 'Se fue a otra agencia por precio. Seguimiento en 3 meses.', createdAt: '2026-03-25', source: 'Google' },
  { id: 'cl8', name: 'Marcela Inzunza Beltrán', phone: '6697890123', email: 'marce.inzunza@gmail.com', status: 'NUEVO', assignedTo: 'u3', budget: 420000, notes: 'Llamó hoy. Quiere HR-V o Seltos.', createdAt: '2026-04-15', source: 'WhatsApp' },
  { id: 'cl9', name: 'Héctor Dávila Cuen', phone: '6698901234', email: 'hdavila@negocio.mx', status: 'NEGOCIACION', assignedTo: 'u3', interestedIn: 'c9', budget: 450000, notes: 'Necesita factura a nombre de empresa. Tax deductible.', createdAt: '2026-04-07', source: 'Facebook' },
  { id: 'cl10', name: 'Sofía Corrales Meza', phone: '6699012345', email: 'sofia.c@gmail.com', status: 'SEGUIMIENTO', assignedTo: 'u3', interestedIn: 'c4', budget: 380000, notes: 'Muy indecisa entre K3 y Corolla. Requiere segunda cita.', createdAt: '2026-04-11', source: 'Instagram' },

  // Clientes de Patricia Ríos (u6)
  { id: 'cl11', name: 'Diego Morales Fuentes', phone: '6691100223', email: 'diego.morales@gmail.com', status: 'CERRADO', assignedTo: 'u6', interestedIn: 'c8', budget: 380000, notes: 'Compró Nissan Kicks. Muy puntual en pagos.', createdAt: '2026-04-03', source: 'Facebook' },
  { id: 'cl12', name: 'Isabel Vargas Díaz', phone: '6692211334', email: 'isavargas@outlook.com', status: 'NEGOCIACION', assignedTo: 'u6', interestedIn: 'c10', budget: 580000, notes: 'Empresaria. Quiere Mazda CX-5 Grand Touring.', createdAt: '2026-04-09', source: 'Página web' },
  { id: 'cl13', name: 'Ricardo Espinoza Ávila', phone: '6693322445', email: 'respinoza@empresa.mx', status: 'SEGUIMIENTO', assignedTo: 'u6', budget: 450000, notes: 'Decidiendo entre Seltos y HR-V. Próxima cita viernes.', createdAt: '2026-04-12', source: 'WhatsApp' },
  { id: 'cl14', name: 'Mónica Pérez Leal', phone: '6694433556', email: 'monperez@gmail.com', status: 'CERRADO', assignedTo: 'u6', interestedIn: 'c3', budget: 445000, notes: 'Compró Kia Seltos SXL. Recomendó a dos amigos.', createdAt: '2026-03-28', source: 'Referido' },
  { id: 'cl15', name: 'Gustavo Ibarra Medrano', phone: '6695544667', email: 'gustavo.ibm@hotmail.com', status: 'NUEVO', assignedTo: 'u6', budget: 320000, notes: 'Primer contacto. Busca sedán o hatchback económico.', createdAt: '2026-04-15', source: 'Instagram' },
  { id: 'cl16', name: 'Daniela Treviño Castro', phone: '6696655778', email: 'dany.trevino@gmail.com', status: 'PERDIDO', assignedTo: 'u6', budget: 400000, notes: 'Se decidió por agencia Nissan por financiamiento.', createdAt: '2026-04-01', source: 'Google' },

  // Clientes de Omar Castro (u7)
  { id: 'cl17', name: 'Armando Zárate Beltrán', phone: '6697766889', email: 'azarate@negocio.com', status: 'NEGOCIACION', assignedTo: 'u7', interestedIn: 'c9', budget: 430000, notes: 'Quiere factura empresa. Negocia precio.', createdAt: '2026-04-07', source: 'Facebook' },
  { id: 'cl18', name: 'Claudia Herrera Ortiz', phone: '6698877990', email: 'claudia.h@gmail.com', status: 'CERRADO', assignedTo: 'u7', interestedIn: 'c6', budget: 315000, notes: 'Compró Chevrolet Captiva. Entrega a domicilio.', createdAt: '2026-04-01', source: 'WhatsApp' },
  { id: 'cl19', name: 'Luis Felipe Garza', phone: '6699988001', email: 'lfgarza@outlook.com', status: 'NUEVO', assignedTo: 'u7', budget: 500000, notes: 'Interesado en camioneta. Ve Taos o Compass.', createdAt: '2026-04-14', source: 'Instagram' },
  { id: 'cl20', name: 'Nadia Quintero Rojas', phone: '6690099112', email: 'nadia.qr@gmail.com', status: 'SEGUIMIENTO', assignedTo: 'u7', interestedIn: 'c4', budget: 360000, notes: 'Joven profesionista. Primera compra.', createdAt: '2026-04-10', source: 'Referido' },
  { id: 'cl21', name: 'Ramón Aguirre Torres', phone: '6691112223', email: 'ramon.at@empresa.mx', status: 'PERDIDO', assignedTo: 'u7', budget: 470000, notes: 'Prefirió auto nuevo de agencia oficial.', createdAt: '2026-03-22', source: 'Google' },

  // Cliente adicional cerrado de Alejandro
  { id: 'cl22', name: 'Pedro Núñez Acosta', phone: '6692223334', email: 'pedro.na@gmail.com', status: 'CERRADO', assignedTo: 'u3', interestedIn: 'c12', budget: 510000, notes: 'Compró Jeep Compass. Pagó enganche + crédito.', createdAt: '2026-04-05', source: 'WhatsApp' },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 's1', clientId: 'cl4', carId: 'c11', sellerId: 'u3',
    finalPrice: 485000, saleDate: '2026-03-28', paymentMethod: 'CONTADO',
    status: 'COMPLETADA', commission: 9700, notes: 'Pago de contado. Entrega inmediata.'
  },
  {
    id: 's2', clientId: 'cl4', carId: 'c7', sellerId: 'u3',
    finalPrice: 390000, saleDate: '2026-04-02', paymentMethod: 'CREDITO',
    status: 'PENDIENTE_DOCS', commission: 7800, notes: 'Crédito en proceso. Falta firma de contrato.'
  },
  // Ventas Patricia Ríos (u6) - Abril
  {
    id: 's3', clientId: 'cl14', carId: 'c3', sellerId: 'u6',
    finalPrice: 440000, saleDate: '2026-04-05', paymentMethod: 'CONTADO',
    status: 'COMPLETADA', commission: 8800, notes: 'Venta de contado. Entrega inmediata.'
  },
  {
    id: 's4', clientId: 'cl11', carId: 'c8', sellerId: 'u6',
    finalPrice: 375000, saleDate: '2026-04-10', paymentMethod: 'CREDITO',
    status: 'COMPLETADA', commission: 7500, notes: 'Crédito aprobado en 48 hrs. Cliente muy satisfecho.'
  },
  // Venta Omar Castro (u7) - Abril
  {
    id: 's5', clientId: 'cl18', carId: 'c6', sellerId: 'u7',
    finalPrice: 310000, saleDate: '2026-04-08', paymentMethod: 'ENGANCHE_CREDITO',
    status: 'COMPLETADA', commission: 6200, notes: 'Enganche 30%. Crédito aprobado.'
  },
  // Venta Alejandro Ruiz (u3) - Abril
  {
    id: 's6', clientId: 'cl22', carId: 'c12', sellerId: 'u3',
    finalPrice: 490000, saleDate: '2026-04-12', paymentMethod: 'ENGANCHE_CREDITO',
    status: 'COMPLETADA', commission: 9800, notes: 'Enganche + crédito. Cliente referido.'
  },
];

export const MOCK_WORKSHOP: WorkshopItem[] = [
  {
    id: 'w1', carId: 'c7', assignedTo: 'u4', startDate: '2026-04-10',
    checklist: { motor: true, frenos: true, estetica: false, llantas: true, electricidad: true, ac: false, documentacion: false },
    cost: 8500, notes: 'Falta pintar cofre menor. AC revisar gas refrigerante.', status: 'EN_PROCESO'
  },
  {
    id: 'w2', carId: 'c12', assignedTo: 'u4', startDate: '2026-04-14',
    checklist: { motor: false, frenos: false, estetica: false, llantas: false, electricidad: false, ac: false, documentacion: false },
    cost: 0, notes: 'Recién ingresado. En evaluación inicial.', status: 'PENDIENTE'
  },
];

// Datos históricos por agente para charts de desempeño
export const AGENT_MONTHLY_DATA = [
  { mes: 'Nov', Alejandro: 1, Patricia: 1, Omar: 1 },
  { mes: 'Dic', Alejandro: 2, Patricia: 2, Omar: 1 },
  { mes: 'Ene', Alejandro: 2, Patricia: 1, Omar: 1 },
  { mes: 'Feb', Alejandro: 2, Patricia: 3, Omar: 1 },
  { mes: 'Mar', Alejandro: 3, Patricia: 2, Omar: 2 },
  { mes: 'Abr', Alejandro: 1, Patricia: 2, Omar: 1 },
];

export const AGENT_MONTHLY_REVENUE = [
  { mes: 'Nov', Alejandro: 485000, Patricia: 375000, Omar: 390000 },
  { mes: 'Dic', Alejandro: 815000, Patricia: 815000, Omar: 470000 },
  { mes: 'Ene', Alejandro: 895000, Patricia: 440000, Omar: 465000 },
  { mes: 'Feb', Alejandro: 820000, Patricia: 1280000, Omar: 300000 },
  { mes: 'Mar', Alejandro: 1360000, Patricia: 915000, Omar: 875000 },
  { mes: 'Abr', Alejandro: 490000, Patricia: 815000, Omar: 310000 },
];

export type MonthlySaleDetail = {
  brand: string; model: string; version: string; year: number;
  price: number; seller: string; client: string; method: string;
};

export const SALES_DETAIL_BY_MONTH: Record<string, MonthlySaleDetail[]> = {
  Nov: [
    { brand: 'Honda',      model: 'Civic',      version: 'EX AUT',        year: 2023, price: 485000, seller: 'Alejandro Ruiz', client: 'Carlos Mendoza',    method: 'Contado' },
    { brand: 'Kia',        model: 'Seltos',     version: 'SX AUT',        year: 2022, price: 375000, seller: 'Patricia Ríos',  client: 'Laura Jiménez',     method: 'Crédito' },
    { brand: 'Nissan',     model: 'Kicks',      version: 'ADVANCE AUT',   year: 2022, price: 390000, seller: 'Omar Castro',      client: 'Roberto Salinas',   method: 'Crédito' },
  ],
  Dic: [
    { brand: 'Toyota',     model: 'Corolla',    version: 'LE AUT',        year: 2023, price: 395000, seller: 'Alejandro Ruiz', client: 'Ana Torres',        method: 'Contado' },
    { brand: 'Honda',      model: 'HR-V',       version: 'UNIQUE AUT',    year: 2022, price: 420000, seller: 'Alejandro Ruiz', client: 'Miguel Ángel Ruiz', method: 'Enganche + Crédito' },
    { brand: 'Mazda',      model: 'CX-30',      version: 'IGT AUT',       year: 2021, price: 380000, seller: 'Patricia Ríos',  client: 'Sofía Herrera',     method: 'Crédito' },
    { brand: 'Kia',        model: 'K3',         version: 'EX PACK AUT',   year: 2023, price: 435000, seller: 'Patricia Ríos',  client: 'Fernando Vega',     method: 'Contado' },
    { brand: 'Chevrolet',  model: 'Captiva',    version: 'LT',            year: 2022, price: 470000, seller: 'Omar Castro',      client: 'Diana Castro',      method: 'Crédito' },
  ],
  Ene: [
    { brand: 'Jeep',       model: 'Compass',    version: 'LATITUDE',      year: 2022, price: 510000, seller: 'Alejandro Ruiz', client: 'Luis Morales',      method: 'Crédito' },
    { brand: 'Volkswagen', model: 'Jetta',      version: 'COMFORTLINE',   year: 2023, price: 385000, seller: 'Alejandro Ruiz', client: 'Patricia Guzmán',   method: 'Contado' },
    { brand: 'Hyundai',    model: 'Grand i10',  version: 'STD',           year: 2023, price: 440000, seller: 'Patricia Ríos',  client: 'Ernesto Núñez',     method: 'Enganche + Crédito' },
    { brand: 'Nissan',     model: 'Sentra',     version: 'SENSE',         year: 2022, price: 465000, seller: 'Omar Castro',      client: 'Valeria Reyes',     method: 'Crédito' },
  ],
  Feb: [
    { brand: 'Ford',       model: 'Territory',  version: 'TITANIUM AUT',  year: 2023, price: 485000, seller: 'Alejandro Ruiz', client: 'Jorge Ramírez',     method: 'Crédito' },
    { brand: 'Honda',      model: 'Civic',      version: 'TOURING AUT',   year: 2024, price: 335000, seller: 'Alejandro Ruiz', client: 'Claudia Peña',      method: 'Contado' },
    { brand: 'Kia',        model: 'Forte',      version: 'LX AUT',        year: 2023, price: 370000, seller: 'Patricia Ríos',  client: 'Ricardo Soto',      method: 'Crédito' },
    { brand: 'Mazda',      model: '3',          version: 'GRAND TOURING', year: 2025, price: 460000, seller: 'Patricia Ríos',  client: 'Mariana López',     method: 'Contado' },
    { brand: 'Toyota',     model: 'Corolla',    version: 'SE AUT',        year: 2024, price: 450000, seller: 'Patricia Ríos',  client: 'Héctor Vargas',     method: 'Enganche + Crédito' },
    { brand: 'Nissan',     model: 'March',      version: 'SENSE',         year: 2023, price: 300000, seller: 'Omar Castro',      client: 'Gabriela Fuentes',  method: 'Crédito' },
  ],
  Mar: [
    { brand: 'Ford',       model: 'Bronco Sport', version: 'BIG BEND',   year: 2022, price: 485000, seller: 'Alejandro Ruiz', client: 'Andrés Delgado',    method: 'Contado' },
    { brand: 'Mazda',      model: 'CX-5',       version: 'GRAND TOURING', year: 2023, price: 475000, seller: 'Alejandro Ruiz', client: 'Isabel Campos',     method: 'Crédito' },
    { brand: 'Hyundai',    model: 'HB20',       version: 'GL AUT',        year: 2023, price: 400000, seller: 'Alejandro Ruiz', client: 'Tomás Ríos',        method: 'Enganche + Crédito' },
    { brand: 'BMW',        model: '330e',       version: 'HÍBRIDO AUT',   year: 2024, price: 515000, seller: 'Patricia Ríos',  client: 'Natalia Espinoza',  method: 'Contado' },
    { brand: 'Kia',        model: 'Seltos',     version: 'SXL AUT',       year: 2024, price: 440000, seller: 'Patricia Ríos',  client: 'César Mendívil',    method: 'Crédito' },
    { brand: 'Volkswagen', model: 'Taos',       version: 'COMFORTLINE',   year: 2022, price: 425000, seller: 'Omar Castro',      client: 'Rosa Elena Parra',  method: 'Crédito' },
    { brand: 'Nissan',     model: 'Frontier',   version: 'PRO-4X AUT',    year: 2022, price: 410000, seller: 'Omar Castro',      client: 'Alberto Quintero',  method: 'Enganche + Crédito' },
  ],
};

export const SALES_MONTHLY_DATA = [
  { mes: 'Nov', ventas: 3, monto: 1250000 },
  { mes: 'Dic', ventas: 5, monto: 2100000 },
  { mes: 'Ene', ventas: 4, monto: 1800000 },
  { mes: 'Feb', ventas: 6, monto: 2400000 },
  { mes: 'Mar', ventas: 7, monto: 3150000 },
  { mes: 'Abr', ventas: 4, monto: 1960000 },
];
