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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  type CreateTransportationDto,
  type UpdateTransportationDto,
} from '../types/transportation.type';
import {
  createTransportationSchema,
  updateTransportationSchema,
  type TransportationFormData,
  type UpdateTransportationFormData,
} from '../schema/transportation.schema';

interface TransportationFormProps<
  T extends CreateTransportationDto | UpdateTransportationDto
> {
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  defaultValues?: Partial<T>;
}

export function TransportationForm<
  T extends CreateTransportationDto | UpdateTransportationDto
>({ onSubmit, isLoading, defaultValues }: TransportationFormProps<T>) {
  const isEditMode = !!defaultValues;

  const form = useForm<TransportationFormData | UpdateTransportationFormData>({
    mode: 'onBlur',
    resolver: zodResolver(
      isEditMode ? updateTransportationSchema : createTransportationSchema
    ),
    defaultValues: {
      companyName: defaultValues?.companyName || '',
      type: defaultValues?.type || undefined,
      class: defaultValues?.class || undefined,
      description: defaultValues?.description || '',
    },
  });

  const handleFormSubmit = (
    values: TransportationFormData | UpdateTransportationFormData
  ) => {
    onSubmit(values as T);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

        {/* Company Name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Company Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type + Class in same row */}
        <div className="flex gap-4">
          {/* Transportation Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Transportation Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="hiAce">HiAce</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Class */}
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Economy">Economy</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description as Textarea */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isEditMode ? 'Update Transportation' : 'Create Transportation'}
        </Button>
      </form>
    </Form>
  );
}
