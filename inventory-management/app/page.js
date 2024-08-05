'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, Button, TextField } from '@mui/material'
import { collection, getDocs, query, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  // Function to update inventory from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  // Function to add an item to the inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={3}
    >
      {/* Modal for adding a new item */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="25%"
          left="40%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')  // Clear the input field
                handleClose()    // Close the modal
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Button to open the modal */}
      <Box display="flex" justifyContent="center" alignItems="center" width="100%">
        <Button
          variant="contained"
          onClick={() => {
            handleOpen()
          }}
        >
          Add New Item
        </Button>
      </Box>

      {/* Box to display the list of inventory items */}
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="150px"
          bgcolor="#4b80b4"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant='h2' color='#333'>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              p={2}
            >
              <Box flex="1" display="flex" alignItems="center">
                <Typography variant='h3' color='#333' textAlign="center" flex="1">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" mx={2}>
                <Typography variant='h3' color='#333' textAlign="center">
                  {quantity}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  removeItem(name)
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
