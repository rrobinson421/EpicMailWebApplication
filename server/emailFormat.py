#emailFormat.py
import struct
#---------------------------------------------------------------------------------------
# This file handles formatting emails uniformly so each email can
# be accessed and handled in the same way. This is similar to building
# a protocol. Safeguards and resource monitoring will not be established
# for this project. 
# The protocol name will be EF. The below is EF's format
# ______________________________________________________
# | sourceIP | destinationIP | serverIP | flags        | 
# |____________________________________________________|
# |  TTLoE   |  designation  |  date    | time         | --TTLoE = Time To Live of Email
# |____________________________________________________| -- end of Header
# |                      Subject                       |
# |____________________________________________________|
# |                     Email Body                     |
# |                        ...                         |
# |____________________________________________________|
#-----------------------------------------------------------------------------------------
