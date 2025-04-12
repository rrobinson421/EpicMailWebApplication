#client.py
import socket
#----------------------------------------------------------
# This python file forms the backend client that handles
# email communication over the network. Clients should be
# able to connect with other users over a server. (P2P
# may or may not be established)
#----------------------------------------------------------
def __main__(): #main function
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('localhost', 7000)) #change later to connect to front end
    client_socket.sendall(b"Hello from client!")  # Send message
    data = client_socket.recv(1024)  # Receive response
    print(f"Recieved from server: {data.decode()}")
    alive = True
    while alive:
        message = input()
        send = bytes(message)
        client_socket.sendall(f"{send}")
        if message == 'exit':
            alive = False
    client_socket.close()
    print("Client closed")
if __name__ == '__main__':
    __main__()