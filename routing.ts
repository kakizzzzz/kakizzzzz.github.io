import { ProjectCategory } from "./types";

export type AppRoute =
  | { view: "journey" }
  | { view: "console" }
  | { view: "contact" }
  | { view: "project"; category: ProjectCategory };

const CATEGORY_TO_SLUG: Record<ProjectCategory, string> = {
  [ProjectCategory.GRAPHIC]: "pattern-design",
  [ProjectCategory.FULL_BRANDING]: "full-branding",
  [ProjectCategory.UI]: "ui-design",
  [ProjectCategory.AMAZON]: "amazon-design",
  [ProjectCategory.ADDITIONAL]: "additional-works",
};

const SLUG_TO_CATEGORY: Record<string, ProjectCategory> = {
  ...Object.entries(CATEGORY_TO_SLUG).reduce(
    (acc, [category, slug]) => {
      acc[slug] = category as ProjectCategory;
      return acc;
    },
    {} as Record<string, ProjectCategory>,
  ),
  "graphic-design": ProjectCategory.GRAPHIC,
};

const BASE_URL = import.meta.env.BASE_URL || "/";
const BASE_PREFIX =
  BASE_URL === "/" ? "" : (BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL);

const withLeadingSlash = (pathname: string) =>
  pathname.startsWith("/") ? pathname : `/${pathname}`;

export const withBasePath = (pathname: string) => {
  const normalizedPathname = withLeadingSlash(pathname);
  return BASE_PREFIX ? `${BASE_PREFIX}${normalizedPathname}` : normalizedPathname;
};

export const toAppPathname = (pathname: string) => {
  if (!BASE_PREFIX) return pathname;
  if (pathname === BASE_PREFIX) return "/";
  if (pathname.startsWith(`${BASE_PREFIX}/`)) {
    return pathname.slice(BASE_PREFIX.length);
  }

  return pathname;
};

export const pathForRoute = (route: AppRoute): string => {
  const pathname = (() => {
    switch (route.view) {
      case "journey":
        return "/journey";
      case "console":
        return "/console";
      case "contact":
        return "/contact";
      case "project":
        return `/project/${CATEGORY_TO_SLUG[route.category]}`;
      default:
        return "/journey";
    }
  })();

  return withBasePath(pathname);
};

const normalizePathname = (pathname: string): string => {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

export const parsePath = (pathname: string): AppRoute => {
  const normalizedPathname = normalizePathname(toAppPathname(pathname));

  if (normalizedPathname === "/" || normalizedPathname === "/journey") {
    return { view: "journey" };
  }

  if (normalizedPathname === "/console") {
    return { view: "console" };
  }

  if (normalizedPathname === "/contact") {
    return { view: "contact" };
  }

  if (normalizedPathname.startsWith("/project/")) {
    const slug = decodeURIComponent(normalizedPathname.replace("/project/", ""));
    const category = SLUG_TO_CATEGORY[slug];
    if (category) {
      return { view: "project", category };
    }
  }

  return { view: "journey" };
};
