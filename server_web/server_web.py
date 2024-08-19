import socket
import os
import gzip
import io
import json

# Define the content directory
content_dir = os.path.join(os.path.dirname(__file__), '..', 'continut')

def get_content_type(file_path):
    extension = os.path.splitext(file_path)[1].lower()
    if extension == '.html':
        return 'text/html'
    elif extension == '.css':
        return 'text/css'
    elif extension == '.js':
        return 'application/javascript'
    elif extension == '.png':
        return 'image/png'
    elif extension == '.jpg' or extension == '.jpeg':
        return 'image/jpeg'
    elif extension == '.gif':
        return 'image/gif'
    elif extension == '.ico':
        return 'image/x-icon'
    elif extension == '.json':
        return 'application/json'
    elif extension == '.xml':
        return 'application/xml'
    else:
        return 'application/octet-stream'
    
 # Recursively search for all files in the "continut" directory and its subdirectories
resources = {}
for root, dirs, files in os.walk(content_dir):
    for file in files:
        file_path = os.path.join(root, file)
        content_type = get_content_type(file_path)
        resources[file_path] = content_type
        
        
           
# Create a server socket using the context manager `with`
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as serversocket:
    # Specify that the server will run on port 5678, accessible from any IP on the server
    serversocket.bind(('', 5678))

    # Set the server to accept a maximum of 5 clients waiting in queue
    serversocket.listen(5)

    while True:
        print('#########################################################################')
        print("Serverul ascultă potențiali clienți.")

        # Wait for a client to connect to the server
        # The `accept` method is blocking, so `clientsocket`, which represents the socket corresponding to the connected client, is returned once a connection is established.
        (clientsocket, address) = serversocket.accept()
        print('S-a conectat un client.')

        # Process the request and read the data received from the client
        request = ''
        data = clientsocket.recv(1024)

        request += data.decode()
        #print("RQUESTUL INTREG "+request+"\n\n")

        # Parse the request string to extract the requested resource name
        start_line = request.split('\r\n')[0]  # Get the first line of the request
        print("linii -> ", start_line)
        uri = start_line.split()[1]  # Get the URI from the start line
        print("avem uri->", uri)

        resource_name = uri.split('/')[-1]  # Get the file name from the URI
        print("si astfel avem anumele resursei -> ", resource_name)

        # Build the full path to the requested resource
        # Get the absolute path of the current working directory
        for root, dirs, files in os.walk(content_dir):
            for file in files:
                if file == resource_name:
                    resource_path = os.path.join(root, file)
        
        # Go back one directory and then go to the "continut" directory
        #print("calea din my mac ->", resource_path)
        # Check if the resource exists on the server
        if os.path.isfile(resource_path):
            print("RESURSA EXISTA")
            # If the resource exists, read its content and compress it using gzip
            with open(resource_path, 'rb') as f:
                content = f.read()
                
            print("start_line.split()[0] --> ", start_line.split()[0])
            if start_line.split()[0] == 'POST' and resource_name == 'utilizatori.json':
                # If the method is POST and the resource name is "utilizatori", save the JSON response to a file named "utilizatori.json"
                print("method IS POST AND NOW INTRU IN TRY")
                try:
                    print("SUNT IN TRY")
                    decoded_data = request.split('\r\n\r\n')[1].strip()
                    print("AM DECODED DATA: "+decoded_data)
                    
                    with open(os.path.join(content_dir, 'resurse/utilizatori.json'), 'r') as infile:
                        # Load the existing JSON data from the file
                        data = json.load(infile)
                        
                    data.append(json.loads(decoded_data))
                    with open(os.path.join(content_dir, 'resurse/utilizatori.json'), 'w') as outfile: 
                        json.dump(data,outfile) 
                        
                except Exception as e:
                    print(f"Error while saving JSON file: {str(e)}")    
            compressed_content = gzip.compress(content)

            # Set the response headers
            response_headers = [
                'HTTP/1.1 200 OK',
                'Content-Type: {}'.format(get_content_type(resource_name)),
                'Content-Encoding: gzip',
                'Content-Length: {}'.format(len(compressed_content)),
                '',
                ''
            ]
            response = '\r\n'.join(response_headers).encode() + compressed_content
        else:
            print("RESURSA NU EXISTA")
            # If the resource does not exist, send an HTTP response with a 404 status code and an
            response = 'HTTP/1.1 404 NOT FOUND\r\n\r\nFile not found'.encode()

        # Send the HTTP response back to the client
        clientsocket.sendall(response)

        # Close the client socket
        clientsocket.close()



