import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import {
  Box,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import type { ReactNode } from "react";
import { Controller } from "react-hook-form";

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <Box>
    <Typography
      variant="body2"
      sx={{ mb: 0.5, fontWeight: 600, color: "#555", textAlign: "right" }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

const TagsField = ({
  label,
  control,
  name,
}: {
  label: string;
  control: any;
  name: string;
}) => (
  <Field label={label}>
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const values: string[] = Array.isArray(field.value)
          ? field.value
          : field.value
            ? String(field.value).split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];
        return (
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={values}
            onChange={(_e, newValue) => field.onChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="הקלד וליחץ Enter להוספה"
              />
            )}
          />
        );
      }}
    />
  </Field>
);

export const ProductEdit = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "products",
      redirect: false,
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} title="עריכת מוצר">
      <Box component="form" autoComplete="off" sx={{ p: 1 }}>
        {/* Basic Info */}
        <Typography variant="h6" sx={{ mb: 2, color: "#65499c" }}>
          פרטים בסיסיים
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Field label="שם בעברית">
              <TextField
                fullWidth
                size="small"
                {...register("name_hebrew", { required: "שדה חובה" })}
                error={!!errors.name_hebrew}
                helperText={errors.name_hebrew?.message as string}
              />
            </Field>
          </Grid>
          <Grid item xs={12}>
            <Field label="תיאור">
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                {...register("description")}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field label="פתרון כללי">
              <Controller
                control={control}
                name="general_solution"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    select
                    size="small"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  >
                    <MenuItem value="">ללא</MenuItem>
                    <MenuItem value="דלילות שיער מקדימה">דלילות שיער מקדימה</MenuItem>
                    <MenuItem value="דלילות שיער מאחורה">דלילות שיער מאחורה</MenuItem>
                  </TextField>
                )}
              />
            </Field>
          </Grid>
          <Grid item xs={12}>
            <Field label="פתרון">
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                {...register("solution")}
              />
            </Field>
          </Grid>
          <Grid item xs={12}>
            <Field label="שיטת חיבור">
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                {...register("attachment_method")}
              />
            </Field>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Pricing */}
        <Typography variant="h6" sx={{ mb: 2, color: "#65499c" }}>
          מחירים
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Field label="מחיר מינימלי (₪)">
              <Controller
                control={control}
                name="price_min"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : parseInt(val, 10));
                    }}
                    inputProps={{ style: { textAlign: "right" }, step: 1 }}
                  />
                )}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field label="מחיר מקסימלי (₪)">
              <Controller
                control={control}
                name="price_max"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : parseInt(val, 10));
                    }}
                    inputProps={{ style: { textAlign: "right" }, step: 1 }}
                  />
                )}
              />
            </Field>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Hair Details */}
        <Typography variant="h6" sx={{ mb: 2, color: "#65499c" }}>
          פרטי שיער
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Field label="בעיית שיער">
              <TextField
                fullWidth
                size="small"
                {...register("hair_concern")}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field label="צבעים זמינים">
              <TextField
                fullWidth
                size="small"
                {...register("available_colors")}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <TagsField label="סוגי שיער" control={control} name="hair_types" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TagsField label="סוג שיער" control={control} name="textures" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TagsField label="אורכי שיער מתאימים" control={control} name="suitable_hair_lengths" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TagsField label="מילות מפתח" control={control} name="matching_keywords" />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Status */}
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  color="primary"
                />
              }
              label="מוצר פעיל"
            />
          )}
        />
      </Box>
    </Edit>
  );
};
