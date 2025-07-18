import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Alert,
  Fade,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Flight as FlightIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import Table from '../components/Table';
import FlightSearchForm, { FlightSearchFormData } from '../components/FlightSearchForm';

import { useFlightQuery, useUpdateFlightOffer } from '../hooks/query/flightQuery';
import ShowIf from '../components/ShowIf';
import { IFlightOffer } from '../types/flightTypes';
import { TableColumn } from '../types/tableTypes';

import { DateCell } from '../components/DateCell';

const TABLE_COLUMNS: TableColumn<IFlightOffer>[] = [
  { 
    field: 'origin', 
    headerName: 'Origin', 
    valueGetter: (params: IFlightOffer) => params.origin 
  },
  { 
    field: 'destination', 
    headerName: 'Destination', 
    valueGetter: (params: IFlightOffer) => params.destination 
  },
  { 
    field: 'departureDate', 
    headerName: 'Departure Date', 
    valueGetter: (params: IFlightOffer) => params.departureDate,
    renderCell: (value: any, row: IFlightOffer, rowId: string, updateCell: (value: any) => void, isEdited: boolean) => (
      <DateCell
        value={value}
        onChange={(value) => updateCell(value)}
      />
    )
  },
  { 
    field: 'returnDate', 
    headerName: 'Return Date', 
    valueGetter: (params: IFlightOffer) => params.returnDate,
    renderCell: (value: any, row: IFlightOffer, rowId: string, updateCell: (value: any) => void, isEdited: boolean) => (
      <DateCell
        value={value}
        onChange={(value) => updateCell(value)}
      />
    )
  },
  { 
    field: 'price', 
    headerName: 'Price', 
    valueGetter: (params: IFlightOffer) => params.price.total 
  },
];


const paperStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)'
};

const styles = {
  header: {
    mb: 4, 
    textAlign: 'center',
    p: 4,
    borderRadius: 3,
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    fontWeight: 700,
    color: 'white',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    mb: 2
  },
  subtitle: {
    mb: 3,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    fontWeight: 400
  },
  searchForm: {
    p: 4,
    mb: 4,
    ...paperStyle
  },
  resultsContainer: {
    ...paperStyle
  },
  resultsHeader: {
    p: 3, 
    borderBottom: '1px solid', 
    borderColor: 'divider' 
  },
  searchSummary: {
    p: 3 
  },
  summaryCard: {
    bgcolor: 'grey.50' 
  },
  summaryCardContent: {
    py: 2 
  }
};


const Header = () => (
  <Box sx={styles.header}>
    <Typography variant="h2" component="h1" gutterBottom sx={styles.title}>
      <FlightIcon sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
      Flight Search
    </Typography>
  </Box>
);

const SearchSummary = ({ searchData }: { searchData: FlightSearchFormData }) => (
  <Box sx={styles.searchSummary}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={styles.summaryCard}>
          <CardContent sx={styles.summaryCardContent}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Origin
            </Typography>
            <Typography variant="h6" component="div">
              {searchData?.origin || 'Not specified'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={styles.summaryCard}>
          <CardContent sx={styles.summaryCardContent}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Departure Date
            </Typography>
            <Typography variant="h6" component="div">
              {searchData?.departureDate || 'Not specified'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

const ResultsHeader = ({ 
  hasResults, 
  dataLength
}: { 
  hasResults: boolean;
  dataLength: number;
}) => (
  <Box sx={styles.resultsHeader}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchIcon color="primary" />
            <Typography variant="h5" component="h2">
              Flight Results
            </Typography>
            {hasResults && (
              <Chip
                label={`${dataLength} flights found`}
                color="primary"
                variant="outlined"
                icon={<TrendingUpIcon />}
              />
            )}
          </Box>
        </Stack>
  </Box>
);

const FlightSearch = () => {
  const [searchData, setSearchData] = useState<FlightSearchFormData>({
    origin: '',
    departureDate: '',
  });

  const { data: flightData, isLoading, error } = useFlightQuery({
    origin: searchData.originCode,
    departureDate: searchData.departureDate,
  });

  const updateFlightOffer = useUpdateFlightOffer(searchData);


  const hasSearchCriteria = useMemo(() => 
    !!searchData.origin && !!searchData.departureDate, 
    [searchData.origin, searchData.departureDate]
  );
  
  const hasResults = useMemo(() => 
    Boolean(flightData?.data && flightData.data.length > 0), 
    [flightData?.data]
  );


  const handleSearchSubmit = (data: FlightSearchFormData) => {
    setSearchData(data);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Header />


      <Paper elevation={0} sx={styles.searchForm}>
        <FlightSearchForm onSubmit={handleSearchSubmit} />
      </Paper>


      <ShowIf condition={hasSearchCriteria}>
        <Fade in={hasSearchCriteria} timeout={500}>
          <Box>
            <Paper elevation={0} sx={styles.resultsContainer}>
              <ResultsHeader 
                hasResults={hasResults}
                dataLength={flightData?.data?.length || 0}
              />

              <SearchSummary searchData={searchData} />


              {error && (
                <Alert severity="error" sx={{ m: 3 }}>
                  Failed to load flight data. Please try again.
                </Alert>
              )}


              {!isLoading && !error && !hasResults && (
                <Alert
                  severity="info"
                  sx={{ m: 3 }}
                  icon={<InfoIcon />}
                >
                  No flights found for your search criteria. Try adjusting your search parameters.
                </Alert>
              )}


              {hasResults && (
                <Table<IFlightOffer>
                  columns={TABLE_COLUMNS}
                  data={flightData?.data || []}
                  isLoading={isLoading}
                  onSaveChanges={updateFlightOffer}
                />
              )}
            </Paper>
          </Box>
        </Fade>
      </ShowIf>
    </Container>
  );
};

export default FlightSearch;