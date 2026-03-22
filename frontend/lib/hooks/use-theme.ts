import { useTheme } from "next-themes";
export function useAppTheme() {
  const { theme, setTheme } = useTheme();
  return { theme, setTheme, isDark: theme === "dark" };
}
