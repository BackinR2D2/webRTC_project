import './App.css';
import Home from './components/Home';
import Room from './components/Room';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react"

function App() {

  return (
    <ChakraProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route 
            exact 
            path="/room/:id"
            component={Room}
          >
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;