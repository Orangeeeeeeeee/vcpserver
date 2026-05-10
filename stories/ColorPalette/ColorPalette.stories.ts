import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ColorPalette from './ColorPalette.vue';

const meta: Meta<typeof ColorPalette> = {
    title: 'Design System/Color Palette',
    component: ColorPalette,
    parameters: {
        layout: 'fullscreen'
    }
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const Default: Story = {};
