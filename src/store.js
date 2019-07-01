import {applyMiddleware, combineReducers, createStore} from "redux";
import {personalInfoReducer} from "./reducers/personal_info_reducer";
import {levelSelectionReducer} from "./reducers/level_selection_reducer";
import {gameReducer} from "./reducers/game_reducer";
import {practiceReducer} from "./reducers/practice_reducer";
import {statsReducer} from "./reducers/stats_reducer";
import thunkMiddleware from "redux-thunk";

const rootReducer = combineReducers({
  personalInfo: personalInfoReducer,
  levels: levelSelectionReducer,
  game: gameReducer,
  practice: practiceReducer,
  stats: statsReducer
});

export const store = createStore(rootReducer, undefined, applyMiddleware(thunkMiddleware));
