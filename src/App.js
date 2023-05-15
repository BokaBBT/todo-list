import "./styles.css";
import addIcon from "./icons/add.svg";
import dotsIcon from "./icons/dots.svg";
import checkboxEmpty from "./icons/checkbox-empty.svg";
import checkboxFilled from "./icons/checkbox-filled.svg";
import { useEffect, useState } from "react";
import trashIcon from "./icons/trash.svg";
import libraryAddCheck from "./icons/library-add-check.svg";

export default function App() {
  const [isTexboxOpen, setIsTexboxOpen] = useState(false);
  const [textareaText, setTextareaText] = useState("");
  const [jobs, setJobs] = useState([
    // {
    //   id: 123,
    //   completed: false,
    //   deleted: false,
    //   text: "Study front-end"
    // },
    // {
    //   id: 398,
    //   completed: false,
    //   deleted: false,
    //   text: "Ride a bike"
    // },
    // {
    //   id: 255,
    //   completed: false,
    //   deleted: false,
    //   text: "Go to gym"
    // }
  ]);

  const [tab, setTab] = useState("todo");
  const [deleteMenu, setDeleteMenu] = useState({
    isOpen: false,
    itemId: null
  });

  const [undoDelete, setUndoDelete] = useState({
    isOpen: false,
    itemId: null
  });

  const addNewJob = () => {
    if (textareaText.trim().lenght === 0) {
      return;
    }
    const newJob = {
      id: Math.floor(Math.random() * 10000),
      completed: false,
      deleted: false,
      text: textareaText
    };
    setJobs((prev) => [newJob, ...prev]);
    setTextareaText("");
  };

  const makeJobCompleted = (item) => {
    console.log(item);
    setJobs((prev) =>
      prev.map((each) => {
        if (each.id === item.id) {
          each.completed = true;
        }
        return each;
      })
    );
  };

  const makeJobUncompleted = (item) => {
    console.log(item);
    setJobs((prev) =>
      prev.map((each) => {
        if (each.id === item.id) {
          each.completed = false;
        }
        return each;
      })
    );
  };

  const showMenu = (event) => {
    if (event.target.className === "dots") {
      setDeleteMenu({ isOpen: true, itemId: event.target.id });
    } else {
      setDeleteMenu({ isOpen: false, itemId: null });
    }
    if (event.target.className === "undo-delete-icon") {
      setUndoDelete({ isOpen: true, itemId: event.target.id });
    } else {
      setUndoDelete({ isOpen: false, itemId: null });
    }
  };
  useEffect(() => {
    window.addEventListener("click", showMenu);
    return () => {
      window.removeEventListener("click", showMenu);
    };
  }, []);

  const deleteItem = (item) => {
    setJobs((prev) =>
      prev.map((each) => {
        if (each.id == item.id) {
          each.deleted = true;
        }
        return each;
      })
    );
  };
  const deleteForever = (item) => {
    setJobs((prev) => prev.filter((each) => each.id != item.id));
  };
  const moveBackToToDo = (item) => {
    setJobs((prev) =>
      prev.map((each) => {
        if (each.id == item.id) {
          return {
            delete: false,
            completed: false,
            text: each.text,
            id: each.id
          };
        }
        return each;
      })
    );
  };
  return (
    <div className="App">
      <h1>Simple To Do List</h1>
      <p>Today is awesome day. The weather is awesome, you are awesome too!</p>

      <div className="button-container">
        <div className="buttons">
          <button
            onClick={() => setTab("todo")}
            className={tab === "todo" ? "current-tab" : ""}
          >
            To do
          </button>
          <button
            onClick={() => setTab("done")}
            className={tab === "done" ? "current-tab" : ""}
          >
            Done
          </button>
          <button
            onClick={() => setTab("trash")}
            className={tab === "trash" ? "current-tab" : ""}
          >
            Trash
          </button>
        </div>
        <img
          onClick={() => setIsTexboxOpen(!isTexboxOpen)}
          src={addIcon}
          alt=""
        />

        <div
          style={{ display: isTexboxOpen == true ? "flex" : "none" }}
          className="new-todo"
        >
          <p> Add New TO DO</p>
          <textarea
            value={textareaText}
            onChange={(event) => setTextareaText(event.target.value)}
            placeholder="Your Text"
            name=""
            id=""
          ></textarea>
          <button onClick={addNewJob}>Add</button>
        </div>
      </div>
      <div className="list">
        <h1>{tab === "todo" ? "To do" : tab === "done" ? "Done" : "Trash"}</h1>
        <hr />

        {tab === "todo"
          ? jobs
              .filter(
                (each) => each.completed === false && each.deleted === false
              )
              .map((item) => (
                <div
                  key={item.id}
                  className={
                    "list-item " +
                    (deleteMenu.isOpen && deleteMenu.itemId == item.id
                      ? "list-item-selected"
                      : "")
                  }
                >
                  <img className="dots" id={item.id} src={dotsIcon} alt="" />
                  <img
                    onClick={() => makeJobCompleted(item)}
                    src={checkboxEmpty}
                    alt=""
                  />
                  <p>{item.text}</p>
                  {deleteMenu.isOpen && deleteMenu.itemId == item.id ? (
                    <div
                      onClick={() => deleteItem(item)}
                      className="delete-menu"
                    >
                      <div>
                        <img src={trashIcon} alt="" />
                        <span>Move to Trash</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))
          : ""}

        {tab === "done"
          ? jobs
              .filter(
                (each) => each.completed === true && each.deleted === false
              )
              .map((item) => (
                <div key={item.id} className="list-item list-item-done">
                  <img className="dots" id={item.id} src={dotsIcon} alt="" />
                  <img
                    onClick={() => makeJobUncompleted(item)}
                    src={checkboxFilled}
                    alt=""
                  />
                  <p>{item.text}</p>
                  {deleteMenu.isOpen && deleteMenu.itemId == item.id ? (
                    <div
                      onClick={() => deleteItem(item)}
                      className="delete-menu"
                    >
                      <div>
                        <img src={trashIcon} alt="" />
                        <span>Move to Trash</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))
          : ""}
        {tab === "trash"
          ? jobs
              .filter((each) => each.deleted === true)
              .map((item) => (
                <div
                  key={item.id}
                  className={
                    "list-item " + (item.completed ? "list-item-done" : "")
                  }
                >
                  <img
                    className="undo-delete-icon"
                    id={item.id}
                    src={dotsIcon}
                    alt=""
                  />
                  <img
                    onClick={() => makeJobUncompleted(item)}
                    src={item.completed ? checkboxFilled : checkboxEmpty}
                    alt=""
                  />
                  <p>{item.text}</p>
                  {undoDelete.isOpen && undoDelete.itemId == item.id ? (
                    <div
                      onClick={() => deleteItem(item)}
                      className="delete-menu"
                    >
                      <div onClick={() => deleteForever(item)}>
                        <img src={trashIcon} alt="" />
                        <span>Delete Forever</span>
                      </div>
                      <div onClick={() => moveBackToToDo(item)}>
                        <img src={libraryAddCheck} alt="" />
                        <span>Move Back To To Do</span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))
          : ""}
      </div>
    </div>
  );
}
