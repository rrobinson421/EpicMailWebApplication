#emailServer
import socket
from multiprocessing import Process
import os
#--------------------------------------------------------------------
# This file holds the emailServer interface that holds email
# clients and establishes communication lines between clients
# SQLite database implemented to handle accounts
#
# (This will likely get changed to the front end server functionality later)
# (This will mainly be used to test the client end)
#--------------------------------------------------------------------
def __main__():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind('localhost', 7000) #change to handle multiple client connections using multi-processesing
    server_socket.listen(1)
    print("Server listening on port 7000")
    connection, addr = server_socket.accept()
    print(f"Connected to {addr}")
    data = server_socket.recv(1024)
    print(f"Recieved from client {data.decode()}")
    connection.sendall(b"Enter username and password or exit")
    if (data.decode() == 'exit'):
        server_socket.close()
    print("Closed")
if __name__ == '__main__':
    __main__()