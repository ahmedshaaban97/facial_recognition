import sys, getopt, time
from imutils import paths
import face_recognition
import argparse
import pickle
import cv2
import os
import requests as req
import numpy as np


def main(argv):
   argument = ''
   usage = 'usage: myscript.py -f <sometext>'
   # parse incoming arguments
   try:
      opts, args = getopt.getopt(argv,"hf:",["foo="])
   except getopt.GetoptError:
      print(usage)
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print(usage)
         sys.exit()
      elif opt in ("-f", "--foo"):
         argument = arg
   # print output









   # load the known faces and embeddings
   #print("[INFO] loading encodings...")
   data = pickle.loads(open('encodings.pickle', "rb").read())


   # load the input image and convert it from BGR to RGB
   #print('requesting img')
   url = "http://172.28.129.105:8080/shot.jpg"
   img_resp = req.get(url)
   #print('done requesting img')
   img_arr = np.array(bytearray(img_resp.content), dtype=np.uint8)
   image = cv2.imdecode(img_arr, -1)
   #print('converting')
   rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
   #print('start etecting')
   # detect the (x, y)-coordinates of the bounding boxes corresponding
   # to each face in the input image, then compute the facial embeddings
   # for each face
   #print("[INFO] recognizing faces...")
   boxes = face_recognition.face_locations(rgb,
                                           model='hog')
   encodings = face_recognition.face_encodings(rgb, boxes)

   # initialize the list of names for each face detected
   names = []




   for encoding in encodings:
       matches = face_recognition.compare_faces(data["encodings"],encoding)
       name = 'UnKnown'
       if True in matches:
           matchedIdxs =  [i for (i, b) in enumerate(matches) if b]
           counts = {}

           for i in matchedIdxs:
               name = data["names"][i]
               counts[name] = counts.get(name, 0) + 1
           name = max(counts, key=counts.get)
       names.append(name)



   # loop over the recognized faces
   for ((top, right, bottom, left), name) in zip(boxes, names):
       # draw the predicted face name on the image
       cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
       y = top - 15 if top - 15 > 15 else top + 15
       cv2.putText(image, name, (left, y), cv2.FONT_HERSHEY_SIMPLEX,
                   0.75, (0, 255, 0), 2)
   #print('gitting the names')
   print(list(names))








if __name__ == "__main__":
    main(sys.argv[1:])