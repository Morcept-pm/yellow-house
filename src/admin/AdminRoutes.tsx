import { Route, Switch } from "wouter";
import { RequireAdmin } from "../components/admin/RequireAdmin";
import { AdminLogin } from "../pages/admin/AdminLogin";
import { Dashboard } from "../pages/admin/Dashboard";
import { Settings } from "../pages/admin/Settings";
import { NewsList } from "../pages/admin/NewsList";
import { NewsEditor } from "../pages/admin/NewsEditor";
import { CasesList } from "../pages/admin/CasesList";
import { CaseEditor } from "../pages/admin/CaseEditor";
import { PropertiesList } from "../pages/admin/PropertiesList";
import { PropertyEditor } from "../pages/admin/PropertyEditor";
import { FormInbox } from "../pages/admin/FormInbox";

export function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <RequireAdmin>
          <Dashboard />
        </RequireAdmin>
      </Route>
      <Route path="/admin/settings">
        <RequireAdmin>
          <Settings />
        </RequireAdmin>
      </Route>
      <Route path="/admin/news">
        <RequireAdmin>
          <NewsList />
        </RequireAdmin>
      </Route>
      <Route path="/admin/news/:id">
        <RequireAdmin>
          <NewsEditor />
        </RequireAdmin>
      </Route>
      <Route path="/admin/cases">
        <RequireAdmin>
          <CasesList />
        </RequireAdmin>
      </Route>
      <Route path="/admin/cases/:id">
        <RequireAdmin>
          <CaseEditor />
        </RequireAdmin>
      </Route>
      <Route path="/admin/properties">
        <RequireAdmin>
          <PropertiesList />
        </RequireAdmin>
      </Route>
      <Route path="/admin/properties/:id">
        <RequireAdmin>
          <PropertyEditor />
        </RequireAdmin>
      </Route>
      <Route path="/admin/forms">
        <RequireAdmin>
          <FormInbox />
        </RequireAdmin>
      </Route>
    </Switch>
  );
}
