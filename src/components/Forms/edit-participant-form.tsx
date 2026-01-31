"use client";
import React, { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { participantService } from "@/services/participant.service";
import { FiCreditCard, FiEdit, FiInfo, FiMail, FiMapPin, FiPhone, FiSave, FiUser } from "react-icons/fi";
import { Alert } from "@/components/ui-elements/alert";
import ErrorMessage from "../FormElements/errormessage";
import { ShowcaseSection } from "../Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { Participant, UpdateParticipantData } from "@/types/participant";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/loader";

interface EditParticipantFormProps {
  participantId: string;
}

export const EditParticipantForm = ({ participantId }: EditParticipantFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "warning">("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const [formData, setFormData] = useState<UpdateParticipantData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    age: 0,
    dni: "",
  });

  const showTemporaryAlert = (
    type: "success" | "error" | "warning",
    title: string,
    description: string,
    duration = 3000
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertDescription(description);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, duration);
  };

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const participant = await participantService.getById(participantId);
        if (participant) {
          setFormData({
            firstName: participant.firstName || "",
            lastName: participant.lastName || "",
            phone: participant.phone || "",
            email: participant.email || "",
            address: participant.address || "",
            age: participant.age || 0,
            dni: participant.dni || "",
          });
        }
      } catch (error: any) {
        if (!error.response) {
          console.error("No response fetching participant", error);
        } else {
          showTemporaryAlert("error", "Error", "No se pudo cargar el participante");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [participantId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ["dni", "phone"];

    if (numericFields.includes(name)) {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      }
    } else if (name === "age") {
      const numValue = parseInt(value) || 0;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    try {
      const response = await participantService.updateParticipant(
        participantId,
        formData
      );

      if (response) {
        if (response.code === 200) {
          showTemporaryAlert("success", "Éxito", "Participante actualizado correctamente");
          setTimeout(() => router.push("/pages/participant"), 1500);
        } else if (response.code === 400 && response.data) {
          setErrors(response.data);
        } else if (response.code === 404) {
          showTemporaryAlert("error", "Error", "Participante no encontrado");
        }
      }
    } catch (error: any) {
      const isNetworkError = error instanceof TypeError || error.message?.includes("Failed to fetch");

      if (isNetworkError) {
        console.log("Error de red manejado globalmente");
        return;
      }

      if (error.response) {
        const { data } = error.response;
        if (data && data.errors) {
          setErrors(data.errors);
          return;
        }
      }

      showTemporaryAlert("error", "Error", "Error al actualizar el participante");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size={60} />
      </div>
    );
  }

  return (
    <ShowcaseSection
      icon={<FiEdit size={24} />}
      title="Editar Participante"
      description="Modifica los datos del participante"
      badgeText={"Modo Edición"}
    >
      {showAlert && (
        <div className="mb-6">
          <Alert variant={alertType} title={alertTitle} description={alertDescription} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full">
          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <InputGroup
                label="Nombres"
                name="firstName"
                type="text"
                placeholder="Ej. Juan"
                value={formData.firstName}
                handleChange={handleChange}
                iconPosition="left"
                icon={<FiUser className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.firstName} />
            </div>

            <div>
              <InputGroup
                label="Apellidos"
                name="lastName"
                type="text"
                placeholder="Ej. Pérez"
                value={formData.lastName}
                handleChange={handleChange}
                iconPosition="left"
                icon={<FiUser className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.lastName} />
            </div>
          </div>
          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <InputGroup
                label="Cédula"
                name="dni"
                type="text"
                placeholder="110XXXXXXX"
                value={formData.dni}
                handleChange={handleChange}
                iconPosition="left"
                icon={<FiCreditCard className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.dni} />
            </div>

            <div>
              <InputGroup
                label="Edad"
                name="age"
                type="number"
                placeholder="25"
                value={formData.age.toString()}
                handleChange={handleChange}
                iconPosition="left"
                icon={<FiUser className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.age} />
            </div>
          </div>

          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <InputGroup
                label="Teléfono"
                name="phone"
                type="text"
                placeholder="099XXXXXXX"
                value={formData.phone}
                handleChange={handleChange}
                iconPosition="left"
                icon={<FiPhone className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.phone} />
            </div>

            <div>
              <InputGroup
                label="Correo Electrónico"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                handleChange={handleChange}
                iconPosition="left"
                icon={<FiMail className="text-gray-400" size={18} />}
              />
              <ErrorMessage message={errors.email} />
            </div>
          </div>

          <div className="mb-4.5">
            <InputGroup
              label="Dirección"
              name="address"
              type="text"
              placeholder="Ej. Av. Universitaria y Calle Principal"
              value={formData.address}
              handleChange={handleChange}
              iconPosition="left"
              icon={<FiMapPin className="text-gray-400" size={18} />}
            />
            <ErrorMessage message={errors.address} />
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <Button
            type="submit"
            disabled={isSaving}
            label={isSaving ? "Actualizando..." : "Actualizar Cambios"}
            shape="rounded"
            icon={!isSaving ? <FiSave size={24} /> : undefined}
          />
        </div>
      </form>
    </ShowcaseSection>
  );
};
