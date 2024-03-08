"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

function TaskCard({task}) {
        const router = useRouter()
        const [edit, setEdit] = useState(false)

        const [newTitle, setNewTitle] = useState(task.title)
        const [newDescription, setNewDescription] = useState(task.description)

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`, {
                method: "DELETE",
            })
            if (res.status === 204 ) {
                router.refresh()
            }
        }
    }

    const handleTaskDone = async (id) => {
        const res = await fetch (`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}/done/`, {
            method: "POST",
        })
        if (res.status === 200) {
            router.refresh()
        }
    }

    const handleUpdate = async (id) => {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}/`, {
            method: "PUT",
            body: JSON.stringify({title: newTitle, description: newDescription}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        setNewTitle(data.title)
        setNewDescription(data.description)

        setEdit(false)
    }

    return (
        <div className="bg-slate-500 px-4 py-3 mb-2 rounded-md text-slate-200 flex 
                justify-between items-center" >
                    <div className="flex flex-col">

                        {
                            !edit ? (
                        <h2 className="font-bold">
                            {newTitle}
                            {task.done && <span>✅</span>}
                        </h2>
                            ) : (
                                <input type="text" placeholder={task.title} 
                                className="bg-slate-500 border-none outline-none text-green-800"
                                onChange={e => setNewTitle(e.target.value)}/>
                            )
                        }

                        {
                            !edit ? (
                                <p>{newDescription}</p>
                            ) : (
                                <textarea placeholder={task.description} 
                                className="bg-slate-500 border-none outline-none text-green-800"
                                rows={1}
                                onChange={e => setNewDescription(e.target.value)}></textarea>
                            )
                        }
                    </div>
                    <div className="flex justify-between gap-x-2">

                        {
                            edit && (
                                <button className="bg-slate-300 text-black rounded-md p-2"
                                onClick={() => handleUpdate(task.id)}>
                                    Save changes</button>
                            )
                        }
                        <button 
                        className= {
                            "text-white rounded-md p-2" + (task.done ? " bg-gray-800" : " bg-green-500")
                        }
                            onClick={() => handleTaskDone(task.id)}
                        >{task.done ? "Undone" : "Done"}
                        </button>
                        <button 
                        className="bg-red-500 text-white rounded-md p-2"
                            onClick={() => handleDelete(task.id)}
                        >Delete</button>
                        <button 
                        className="bg-indigo-500 text-white rounded-md p-2"
                        onClick={() => setEdit(!edit)}
                        >Update</button>
                    </div>
                </div>
    )
}
export default TaskCard