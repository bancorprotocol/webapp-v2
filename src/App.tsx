import { NotFound } from 'pages/NotFound';
import { Swap } from 'pages/Swap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ButtonSamples } from 'pages/ButtonSamples';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LayoutHeader } from './elements/layoutHeader/LayoutHeader';
import { poolActions } from 'redux/actions';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(poolActions.triggerAction());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <LayoutHeader />
      <Switch>
        <Route exact strict path="/" component={Swap} />
        <Route exact strict path="/buttons" component={ButtonSamples} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};
