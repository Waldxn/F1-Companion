import React, { useEffect, useState } from 'react'

import Dropdown from '../Dropdown/Dropdown.tsx'
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import '@fontsource/roboto'
import './constructorlist.css'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

function ConstructorList (): JSX.Element {
  const [constructorsMap, setConstructorsMap] = useState(new Map())
  const [selectedYear, setSelectedYear] = useState(2023)
  const [isLoading, setIsLoading] = useState(true)
  const rows = []

  useEffect(() => {
    setIsLoading(true)
    void fetch(`https://ergast.com/api/f1/${selectedYear}/constructorStandings.json`)
      .then(async response => await response.json())
      .then(data => {
        const constructors = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
        const constructorsObj = constructors.reduce((acc: any, constructor: any) => {
          const { constructorId, name, nationality, url } = constructor.Constructor
          const { position, points, wins } = constructor
          acc[constructorId] = { constructorId, name, nationality, url, position, points, wins }
          return acc
        }, {})
        const constructorsMap = new Map(Object.entries(constructorsObj))
        setConstructorsMap(constructorsMap)
        setIsLoading(false)
      })
  }, [selectedYear])

  // Year select functionality
  const yearsList = []
  const currentYear = new Date().getFullYear()
  const earliestYear = 1958
  for (let year = currentYear; year >= earliestYear; year--) {
    yearsList.push(year)
  }

  function handleYearSelect (value: number): void {
    setSelectedYear(value)
  }

  interface data {
    name: string
    position: string
    points: string
    wins: string
    nationality: string
  }

  function createData (name: string, position: string, points: string, wins: string, nationality: string): data {
    return { name, position, points, wins, nationality }
  }

  for (const team of constructorsMap.values()) {
    const nationality = team.nationality
    const position = team.position
    const points = team.points
    const wins = team.wins
    const name = team.name
    const data = createData(name, position, points, wins, nationality)
    rows.push(data)
  }

  function getPositionStyle (position: string): { backgroundColor: string, fontWeight: string } {
    let backgroundColor = '#f3f3f3'
    let fontWeight = 'regular'
    switch (position) {
      case '1':
        backgroundColor = '#C9B037'
        fontWeight = 'bold'
        break
      case '2':
        backgroundColor = '#D7D7D7'
        fontWeight = 'bold'
        break
      case '3':
        backgroundColor = '#AD8A56'
        fontWeight = 'bold'
        break
      default:
        break
    }

    switch (backgroundColor) {
      case '#f3f3f3':
        if (parseInt(position) > 3) {
          backgroundColor = parseInt(position) % 2 === 0 ? '#f9f9f9' : '#ffffff'
        }
        break
      default:
        break
    }
    return {
      backgroundColor,
      fontWeight
    }
  }

  return (
    <Box sx={{ display: 'flex', mt: '16px', flexDirection: 'column', alignItems: 'center' }}>
      <TableContainer component={Paper} className="constructor-table-container"
                      sx={{
                        maxWidth: '1000px',
                        backgroundColor: '#f9f9f9',
                        overflowY: 'scroll',
                        height: '675px',
                        position: 'relative'
                      }}>
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress/>
          </div>
        )}
        <Box sx={{
          my: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h4" sx={{
            ml: '145px',
            justifyContent: 'center',
            textAlign: 'center',
            flexGrow: 1,
            display: 'flex',
            fontWeight: 'bold'
          }}>{selectedYear} Constructor Standings</Typography>
          <Dropdown options={yearsList} onSelect={handleYearSelect}
                    selectedValue={selectedYear} label="Year"/>
        </Box>
        <Divider/>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#f1f1f1', position: 'sticky', top: 0 }}>
            <TableRow>
              <TableCell sx={{ display: 'flex' }}> <EmojiEventsIcon/></TableCell>
              <TableCell align="left" sx={{ fontSize: 'large' }}>Constructor Name</TableCell>
              <TableCell align="left" sx={{ fontSize: 'large' }}>Points</TableCell>
              <TableCell align="left" sx={{ fontSize: 'large' }}>Wins</TableCell>
              <TableCell align="left" sx={{ fontSize: 'large' }}>Nationality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.position}
                        sx={{ backgroundColor: index % 2 !== 0 ? '#f9f9f9' : '#ffffff' }}>
                <TableCell align="center" scope="row"
                           sx={{ width: '10px', ...getPositionStyle(row.position) }}>{row.position}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.points}</TableCell>
                <TableCell align="left">{row.wins}</TableCell>
                <TableCell align="left">{row.nationality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>)
}

export default ConstructorList
