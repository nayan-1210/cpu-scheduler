# CPU Scheduler


## How to Install

1. Clone the repository in your local computer.
2. Move the backend folder to some other location in your local computer.
3. Install latest version of node and npm.
4. Run the command "npm install react-router-dom" for working of react router.
5. Run the command "npm install socket.io-client" for supporting websocket connection
6. For flask, run the below commands in terminal "pipenv install flask-socketio" , "pip install flask-socketio" for supporting websocket connection.
7. In the backend folder, inside backend.py file, change cpp_file to the actual location of main.cpp as per your computer (line no 15 of backend.py in backend folder)

## How to Run
1. For backend, inside backend folder, run the following command "python backend.py" in terminal
2. For frontend, run the following command "npm start" in terminal
3. Webpage will open. Click getstarted button, then enter the number of process, upload the input.txt file from the backend folder, click on submit.
4. Click on view results. You will be directed to new page. Click on "Click to compare performance and statistics of different algorithms" button.

## "input.txt" file
Format: name,arrival_time,burst_time
[Sample](https://github.com/nayan-1210/cpu-scheduler/blob/main/Backend/input.txt)

## Working of CPU Scheduler
The project helps users to schedule processes, given their arrival times and burst times, using each of the following algorithms:

First Come First Serve (FCFS)
Shortest Job First (SJF)
Shortest Remaining Time First (SRTF)
Round Robin (RR)

### First Come First Serve (FCFS)
First Come First Serve (FCFS) is the simplest scheduling algorithm where the process that arrives first gets executed first. The steps involved in FCFS are:

1. Sort the processes by their arrival times.
2. Schedule the processes in the order of their arrival times.
3. Execute the processes sequentially, without preemption.

### Shortest Job First (SJF)
Shortest Job First (SJF) is a non-preemptive scheduling algorithm where the process with the shortest burst time is selected for execution next. The steps involved in SJF are:

1. Maintain a priority queue with pairs of {process, burst time}.
2. Sort the processes based on their burst times.
3. After every process gets executed, select the process with the shortest burst time from the priority queue and execute it.
   
### Shortest Remaining Time First (SRTF)
Shortest Remaining Time First (SRTF) is a preemptive version of the SJF algorithm. Here, the process with the shortest remaining burst time is selected for execution, and the currently running process can be preempted if a new process with a shorter burst time arrives. The steps involved in SRTF are:

1. Maintain a priority queue with pairs of {process, remaining burst time}.
2. Sort the processes based on their remaining burst times.
3. Check for new processes at every unit of time.
4. If a new process arrives and its burst time is shorter than the remaining time of the current process, preempt the current process and execute the new process.
   
### Round Robin (RR)
Round Robin (RR) is a preemptive scheduling algorithm where each process gets executed for a fixed time slice (quantum) in a cyclic order. The steps involved in RR are:

1. Maintain a queue of processes.
2. Assign a time quantum to each process.
3. Execute the processes for the assigned time quantum.
4. If a process does not complete within the time quantum, move it to the end of the queue and continue with the next process.
5. Repeat the steps until all processes are completed.

## GUI 
[sample](https://drive.google.com/drive/folders/1M5UuNlWaSupCJPDv0nFzOUdYMh65hpOs?usp=drive_link)
For better quality, download the images

