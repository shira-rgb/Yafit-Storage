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

export const ProductEdit = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "products",
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
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register("price_min", { valueAsNumber: true })}
                inputProps={{ style: { textAlign: "right" } }}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field label="מחיר מקסימלי (₪)">
              <TextField
                fullWidth
                type="number"
                size="small"
                {...register("price_max", { valueAsNumber: true })}
                inputProps={{ style: { textAlign: "right" } }}
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
            <Field label="סוגי שיער (הפרדה בפסיק)">
              <Controller
                control={control}
                name="hair_types"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    size="small"
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean);
                      field.onChange(arr);
                    }}
                  />
                )}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field label="סוג שיער (הפרדה בפסיק)">
              <Controller
                control={control}
                name="textures"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    size="small"
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean);
                      field.onChange(arr);
                    }}
                  />
                )}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field label="אורכי שיער מתאימים (הפרדה בפסיק)">
              <Controller
                control={control}
                name="suitable_hair_lengths"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    size="small"
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean);
                      field.onChange(arr);
                    }}
                  />
                )}
              />
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field label="מילות מפתח (הפרדה בפסיק)">
              <Controller
                control={control}
                name="matching_keywords"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    size="small"
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean);
                      field.onChange(arr);
                    }}
                  />
                )}
              />
            </Field>
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
