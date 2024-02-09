### Disclaimer
This program will not work for anything except files and directories(folders).

### About
Packer is packaging software that can be used to pack directories into a single file which can easily be transferred over networks or to other machines. The software can then be used to unpack the directories to the local environment.

# ============= Packing =============
- To start packing first of all head over to the `Configuration.txt` file included with the repository and add the directory path inside the two double-quotes ("") in-front of the `DirectoryPath`. **Make sure that the path starts with the disk name (For example: C:/ or C:\\).**
*Example:* `C:/DataFolder/UsersData`
- Once the directory path has been added, move over to the next line in the file and you should see `Mode`, add `Packing` inside the two double-quotes ("") provided in-front of it.
- Ignore anything else inside the file as it is not required at this stage.

The file should now be looking something like below:
```json
{
    "DirectoryPath": "C:/DataFolder/UsersData",
    "Mode": "Packing",
    "OverWriteExisting": false
}
```

Now run the `Packer.js` file and everything should be packed into a single file named `Packet.json` which will be located in the same directory as the `Packer.js` file. Transfer this file onto another computer such as a server and unpack it there by following the below instructions.
Incase of any errors, kindly follow the instructions provided by them.

# ============= Unpacking =============
- To start unpacking head back over to the `Configuration.txt` file and change the `Mode` from `Packing` to `Unpacking` as done before.
- If you want the program to overwrite existing data (Files and Directories) then set change `false` written in-front of `OverWriteExisting` to `true`.

The file should now be looking something like below:
```json
{
    "DirectoryPath": "C:/DataFolder/UsersData",
    "Mode": "Unpacking",
    "OverWriteExisting": false
}
```
*OR*
```json
{
    "DirectoryPath": "C:/DataFolder/UsersData",
    "Mode": "Packing",
    "OverWriteExisting": true
}
```

Now just as before run the `Packer.js` file and everything should be unpacked to the provided path.
Enjoy!
