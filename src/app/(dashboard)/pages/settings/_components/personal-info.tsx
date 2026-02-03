"use client";

import { useState, useEffect, useMemo } from "react";
import { userService, UserProfileData } from "@/services/user.services";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { Alert } from "@/components/ui-elements/alert";
import { FiEdit, FiAlertTriangle, FiUser, FiPhone, FiMapPin, FiLock, FiSave } from "react-icons/fi";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui-elements/button";

const HARDCODED_ACCOUNTS = ["dev@kallpa.com", "admin@kallpa.com"];

export function PersonalInfoForm() {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [formData, setFormData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState<"success" | "error" | "warning">("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const isHardcodedAccount = useMemo(() => {
    return HARDCODED_ACCOUNTS.includes(userEmail.toLowerCase());
  }, [userEmail]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const result = await userService.getProfile();
        const profile = result.data;

        if (profile) {
          setFormData({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            phone: profile.phone || "",
            address: profile.address || "",
            password: "",
          });
          setUserEmail(profile.email || "");
        }
      } catch (error) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setFormData({
            firstName: parsedUser.firstName || "",
            lastName: parsedUser.lastName || "",
            phone: parsedUser.phone || "",
            address: parsedUser.address || "",
            password: "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const triggerAlert = (
    variant: "success" | "error" | "warning",
    title: string,
    description: string,
  ) => {
    setAlertVariant(variant);
    setAlertTitle(title);
    setAlertDescription(description);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: any = await userService.updateProfile(formData);

      if (response.status === "success" || response.status === "ok") {
        const responseData = response.data || {};
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...storedUser,
          first_name: responseData.firstName || formData.firstName,
          last_name: responseData.lastName || formData.lastName,
          firstName: responseData.firstName || formData.firstName,
          lastName: responseData.lastName || formData.lastName,
          phone: responseData.phone || formData.phone,
          address: responseData.address || formData.address,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        triggerAlert(
          "success",
          "Tu perfil se ha actualizado correctamente.",
          "Perfil actualizado",
        );

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        triggerAlert(
          "error",
          "Error al actualizar perfil",
          response.msg || "Ocurrió un error al actualizar tu perfil.",
        );
      }
    } catch (error: any) {
      console.error("Error completo:", error);
      const message =
        error.response?.data?.msg || error.message || "Error al actualizar el perfil.";
      triggerAlert("error", "Error al actualizar perfil", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShowcaseSection
      icon={<FiEdit size={24} />}
      title="Información Personal"
      description="Actualiza tus datos personales"
    >
      {showAlert && (
        <div className="mb-5">
          <Alert
            variant={alertVariant}
            title={alertTitle}
            description={alertDescription}
          />
        </div>
      )}
      {isHardcodedAccount && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <FiAlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Cuenta de sistema
            </p>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
              Esta es una cuenta de desarrollo/administración y no puede ser editada desde aquí.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <InputGroup
              label="Nombre"
              name="firstName"
              type="text"
              placeholder="Tu nombre"
              value={formData.firstName}
              handleChange={handleChange}
              disabled={isHardcodedAccount}
              iconPosition="left"
              icon={<FiUser className="text-gray-400" size={18} />}
            />
          </div>

          <div className="w-full sm:w-1/2">
            <InputGroup
              label="Apellido"
              name="lastName"
              type="text"
              placeholder="Tu apellido"
              value={formData.lastName}
              handleChange={handleChange}
              disabled={isHardcodedAccount}
              iconPosition="left"
              icon={<FiUser className="text-gray-400" size={18} />}
            />
          </div>
        </div>

        <div className="mb-5.5">
          <InputGroup
            label="Teléfono"
            name="phone"
            type="text"
            placeholder="099..."
            value={formData.phone}
            handleChange={handleChange}
            disabled={isHardcodedAccount}
            iconPosition="left"
            icon={<FiPhone className="text-gray-400" size={18} />}
          />
        </div>

        <div className="mb-5.5">
          <InputGroup
            label="Dirección"
            name="address"
            type="text"
            placeholder="Tu dirección"
            value={formData.address}
            handleChange={handleChange}
            disabled={isHardcodedAccount}
            iconPosition="left"
            icon={<FiMapPin className="text-gray-400" size={18} />}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            label={loading ? "Guardando..." : "Guardar Cambios"}
            shape="rounded"
            icon={
              loading ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <FiSave size={24} />
              )
            }
            disabled={loading || isHardcodedAccount}
            className="mt-2 w-full"
          />
        </div>
      </form>
    </ShowcaseSection>
  );
}

