import { Refine, Authenticated } from "@refinedev/core";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ThemedTitleV2,
  RefineSnackbarProvider,
} from "@refinedev/mui";
import { CssBaseline, ThemeProvider, createTheme, GlobalStyles } from "@mui/material";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
} from "@refinedev/react-router-v6";
import { dataProvider } from "@refinedev/supabase";
import ContentCutIcon from "@mui/icons-material/ContentCut";

import { supabaseClient } from "./supabaseClient";
import { authProvider } from "./authProvider";
import { LoginPage } from "./pages/login";
import { ProductList } from "./pages/products/list";
import { ProductEdit } from "./pages/products/edit";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#9575cd",
      light: "#c7a4ff",
      dark: "#65499c",
      contrastText: "#fff",
    },
    secondary: {
      main: "#b39ddb",
    },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: { direction: "rtl" },
            // Move sidebar to the right
            ".MuiDrawer-paper": { right: 0, left: "auto !important" },
            ".MuiDrawer-root": { right: 0, left: "auto" },
          }}
        />
        <RefineSnackbarProvider>
          <AppInner />
        </RefineSnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function AppInner() {
  const notificationProvider = useNotificationProvider();

  return (
    <Refine
      dataProvider={dataProvider(supabaseClient)}
      authProvider={authProvider}
      routerProvider={routerBindings}
      notificationProvider={notificationProvider}
      resources={[
        {
          name: "products",
          list: "/products",
          edit: "/products/edit/:id",
          meta: { label: "מוצרים" },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      <Routes>
        <Route
          element={
            <Authenticated key="main" fallback={<CatchAllNavigate to="/login" />}>
              <ThemedLayoutV2
                Title={({ collapsed }) => (
                  <ThemedTitleV2
                    collapsed={collapsed}
                    text="YK Hair"
                    icon={<ContentCutIcon />}
                  />
                )}
              >
                <Outlet />
              </ThemedLayoutV2>
            </Authenticated>
          }
        >
          <Route index element={<NavigateToResource resource="products" />} />
          <Route path="/products">
            <Route index element={<ProductList />} />
            <Route path="edit/:id" element={<ProductEdit />} />
          </Route>
        </Route>
        <Route
          element={
            <Authenticated key="login" fallback={<Outlet />}>
              <Navigate to="/" />
            </Authenticated>
          }
        >
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Refine>
  );
}

export default App;
