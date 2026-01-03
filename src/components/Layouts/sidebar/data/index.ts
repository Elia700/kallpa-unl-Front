import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/dashboard",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Form Elements",
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Tables",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
      {
        title: "Participantes",
        icon: Icons.User,
        items: [
          {
            title: "Listado",
            url: "/pages/participant",
          },
          {
            title: "Registrar Nuevo",
            url: "/pages/participant/register",
          },
        ],
      },
      {
        title: "Asistencia",
        icon: Icons.Calendar,
        items: [
          {
            title: "Dashboard",
            url: "/pages/attendance",
          },
          {
            title: "Participantes",
            url: "/pages/attendance/participantes",
          },
          {
            title: "Historial",
            url: "/pages/attendance/historial",
          },
          {
            title: "Programar",
            url: "/pages/attendance/programar",
          },
        ],
      },
      {
        title: "Medidas Antro",
        icon: Icons.TapeMeasureIcon,
        items: [
          {
            title: "Registrar",
            url: "/anthropometric/form",
          },
        ],
      },
      {
        title: "Evaluaciones",
        icon: Icons.DumbbellIcon,
        items: [
          {
            title: "Registrar Test",
            url: "/evolution/form-test",
          },
          {
            title: "Asignar Test",
            url: "/evolution/assign-test",
          },
        ],
      },
      {
        title: "Historial",
        url: "/history/measurements",
        icon: Icons.HistoryIcon,
        items: [],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Usuarios",
        url: "/pages/user",
        icon: Icons.Table,
        items: [],
      },
    ],
  },
];
