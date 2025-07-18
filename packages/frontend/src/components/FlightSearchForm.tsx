import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Stack,
  Alert,
  Fade,
  Chip,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Flight as FlightIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import { useAirportsAndCitiesQuery } from "../hooks/query/flightQuery";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export interface FlightSearchFormData {
  origin: string;
  originCode?: string;

  departureDate: string;
}

const validationSchema = yup.object({
  origin: yup.string().required("Origin is required"),
  originCode: yup.string().optional(),
  departureDate: yup
    .string()
    .required("Departure date is required")
    .test(
      "date-range",
      "Date must be between today and 180 days from now",
      function (value) {
        if (!value) return false;

        const selectedDate = dayjs(value);
        const today = dayjs().startOf("day");
        const maxDate = dayjs().add(180, "days").endOf("day");

        return (
          selectedDate.isValid() &&
          selectedDate.isSameOrAfter(today) &&
          selectedDate.isSameOrBefore(maxDate)
        );
      }
    ),
});

interface FlightSearchFormProps {
  onSubmit: (data: FlightSearchFormData) => void;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSubmit }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<FlightSearchFormData>({
    defaultValues: {
      origin: "",
      departureDate: "",
      originCode: "",
    },
    mode: "onBlur",
    resolver: async (values) => {
      try {
        await validationSchema.validate(values, { abortEarly: false });
        return { values, errors: {} };
      } catch (error: any) {
        const errors: any = {};
        if (error.inner) {
          error.inner.forEach((err: any) => {
            errors[err.path] = { type: "validation", message: err.message };
          });
        }
        return { values: {}, errors };
      }
    },
  });
  
  const [searchKeyword, setSearchKeyword] = useState("");
  const { data: airportsAndCities, isLoading } = useAirportsAndCitiesQuery({
    keyword: searchKeyword,
  });

  const watchedOrigin = watch("origin");
  const watchedDate = watch("departureDate");
  const hasValidInputs = Boolean(watchedOrigin && watchedDate && isValid);

  return (
    <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>Find Flights </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>

          <Box> 
            <Autocomplete
              value={
                airportsAndCities?.find(
                  (option) => option.name === watchedOrigin
                ) || null
              }
              options={airportsAndCities || []}
              getOptionLabel={(option: any) => {
                if (typeof option === "string") return option;
                return option?.name || "";
              }}
              isOptionEqualToValue={(option: any, value: any) => {
                return option?.name === value?.name;
              }}
              onInputChange={(_: any, newInputValue: string) => {
                setSearchKeyword(newInputValue);
              }}
              onChange={(_: any, newValue: any) => {
                if (typeof newValue === "string") {
                  setValue("origin", newValue);
                } else if (
                  newValue &&
                  typeof newValue === "object" &&
                  "name" in newValue
                ) {
                  setValue("origin", newValue?.name || "");
                  setValue("originCode", newValue?.iataCode || "");
                } else {
                  setValue("origin", "");
                }
              }}
              onBlur={() => {
                trigger("origin");
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="Origin"
                  placeholder="Search for a city or airport"
                  required
                  error={!!errors.origin}
                  helperText={errors.origin?.message}
                  size="medium"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              loading={isLoading}
              noOptionsText="No cities found"
              freeSolo
              inputValue={searchKeyword}
            />
          </Box>


          <Box>

            <DatePicker
              label="Departure Date"
              value={
                watchedDate ? dayjs(watchedDate) : null
              }
              onChange={(newValue) =>
                setValue(
                  "departureDate",
                  newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
                )
              }
              slotProps={{
                textField: {
                  required: true,
                  error: !!errors.departureDate,
                  helperText: errors.departureDate?.message,
                  size: "medium",
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
              format="MMM DD, YYYY"
              maxDate={dayjs().add(6, "month")}
              minDate={dayjs()}
              onClose={() => {
                trigger("departureDate");
              }}
            />
          </Box>


          <Box sx={{ pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !hasValidInputs}
              size="large"
              fullWidth
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #cbd5e1 0%, #a1a1aa 100%)',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease-in-out',
              }}
              startIcon={<SearchIcon />}
            >
              {isSubmitting ? "Searching..." : "Search Flights"}
            </Button>
          </Box>



          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              <Chip 
                label="180 days max" 
                size="small" 
                variant="outlined" 
                color="info"
              />
              <Chip 
                label="Instant results" 
                size="small" 
                variant="outlined" 
                color="primary"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default FlightSearchForm;
