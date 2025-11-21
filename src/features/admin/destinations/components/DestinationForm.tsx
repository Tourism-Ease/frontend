import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  type CreateDestinationDto,
  type UpdateDestinationDto,
} from '../types/destination.type';
import {
  createDestinationSchema,
  updateDestinationSchema,
  type DestinationFormData,
  type UpdateDestinationFormData,
} from '../schema/destination.schema';

interface DestinationFormProps<
  T extends CreateDestinationDto | UpdateDestinationDto
> {
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  defaultValues?: Partial<T>;
}

export function DestinationForm<
  T extends CreateDestinationDto | UpdateDestinationDto
>({ onSubmit, isLoading, defaultValues }: DestinationFormProps<T>) {
  const isEditMode = !!defaultValues;

  const form = useForm<DestinationFormData | UpdateDestinationFormData>({
    mode: 'onBlur',
    resolver: zodResolver(
      isEditMode ? updateDestinationSchema : createDestinationSchema
    ),
    defaultValues: {
      name: defaultValues?.name || '',
      country: defaultValues?.country || '',
      city: defaultValues?.city || '',
      description: defaultValues?.description || '',
    },
  });

  const handleFormSubmit = (
    values: DestinationFormData | UpdateDestinationFormData
  ) => {
    onSubmit(values as T);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Destination Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="City" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isEditMode ? 'Update Destination' : 'Create Destination'}
        </Button>
      </form>
    </Form>
  );
}
