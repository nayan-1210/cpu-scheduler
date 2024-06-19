from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app, cors_allowed_origins="*")


def executecpp():
    print("hello world")
    
    cpp_file = 'C:\\Users\\dell\\Desktop\\CPU Scheduler\\main.cpp'
    output_executable = 'main'


    if not os.path.isfile(cpp_file):
        print(f"Error: {cpp_file} not found in the current directory.")
    else:
        
        compile_command = ['g++', cpp_file, '-o', output_executable]
        compile_process = subprocess.run(compile_command, capture_output=True, text=True)

        
        if compile_process.returncode != 0:
            print(f"Compilation failed:\n{compile_process.stderr}")
        else:
            print(f"Compilation succeeded:\n{compile_process.stdout}")


            
            run_command = ['./' + output_executable]
            run_process = subprocess.run(run_command, capture_output=True, text=True)

            
            if run_process.returncode != 0:
                print(f"Execution failed:\n{run_process.stderr}")
            else:
                print(f"Execution succeeded:\n{run_process.stdout}")



@app.route('/')
def index():
    return "WebSocket server is running."

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('send_file')
def handle_file_receive(data):
    file_content = data['file']
    num_processes = data['numProcesses']  
    print('Received file content:', file_content)
    print('Number of processes:', num_processes)

    with open('received_file.txt', 'w') as file:
        file.write(f'{num_processes}\n')
        file.write(file_content)
    
    
    emit('file_received', {'status': 'File received successfully'})
    executecpp()


@socketio.on('request_files')
def handle_files_request():
    print("requested files")
    response = {}
    try:
        with open('output.txt', 'r') as file:
            response['output_file'] = file.read()
    except FileNotFoundError:
        response['output_file'] = ''
        response['output_file_status'] = 'File not found'
    else:
        response['output_file_status'] = 'File sent successfully'

    try:
        with open('arrival.txt', 'r') as file:
            response['arrival_file'] = file.read()
    except FileNotFoundError:
        response['arrival_file'] = ''
        response['arrival_file_status'] = 'File not found'
    else:
        response['arrival_file_status'] = 'File sent successfully'

    emit('receive_files', response)


if __name__ == '__main__':
    socketio.run(app, debug=True)
