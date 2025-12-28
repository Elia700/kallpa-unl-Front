export interface Participant {
  id?: number; 
  external_id?: string; 
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  tipo: "ESTUDIANTE" | "DOCENTE" | "ADMINISTRATIVO" | "EXTERNO";
  correo?: string;
  telefono?: string;
  direccion?: string;
  estado?: "ACTIVO" | "INACTIVO";
}

// Tipo para el registro complejo (Niño + Padre)
export interface InitiationRequest {
  participante: Participant;
  responsable: {
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    parentesco: string;
  };
}