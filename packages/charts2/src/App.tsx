import { ChartWeb } from './lib';

const App = () => {
  return (
    <div
      id="app"
      style={{
        flex: 1,
        alignSelf: 'stretch',
        padding: 64,
        backgroundColor: 'teal',
      }}
    >
      <ChartWeb />
    </div>
  );
};

export default App;
