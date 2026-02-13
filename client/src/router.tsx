import { Switch, Route } from "wouter";
import HomePage from "./pages/HomePage";
import ParkourLegend from "./games/parkour-legend/ParkourLegend";

export default function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/games/parkour-legend" component={ParkourLegend} />
    </Switch>
  );
}
