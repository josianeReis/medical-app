"use client";

import * as React from "react";
import {
  //AudioWaveform,
  BookOpen,
  Bot,
 // Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  //Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "../components/nav-main";
//import { NavProjects } from "../components/nav-projects";
import { NavUser } from "../components/nav-user";
import { TeamSwitcher } from "../components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../../../../../packages/ui-components/src/components/ui/sidebar";
import { User } from "@/services/auth/auth-client";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Nexareport",
      logo: GalleryVerticalEnd,
      plan: "",
      },
      /*
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
    */
    
  ],
  navMain: [
    {
      title: "Templates",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Meus templetes ",
          url: "my-templates",
        },
        {
          title: "Modelos ",
          url: "#",
        },
      ],
    },
    {
      title: "Cadastros",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Paciente",
          url: "patient-list",
        },
      ],
    },
    {
      title: "Laudos",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Consulta",
          url: "#",
        },
        {
          title: "Gerar novo laudo",
          url: "dashboard2",
        },
        {
          title: "Deleção de laudo",
          url: "#",
        },
      ],
    },
   
    /*{
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },*/
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
