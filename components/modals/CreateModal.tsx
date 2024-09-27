export interface CreateModalProps<T, R = void> {
  onSubmit: (data: T) => Promise<R>;
}
