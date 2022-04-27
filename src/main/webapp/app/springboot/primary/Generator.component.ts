import { ProjectService } from '@/springboot/domain/ProjectService';
import { defineComponent, inject, ref } from 'vue';
import { ProjectToUpdate, toProject } from '@/springboot/primary/ProjectToUpdate';
import { Logger } from '@/common/domain/Logger';
import { AngularGeneratorVue } from '@/springboot/primary/angular-generator';
import { ReactGeneratorVue } from '@/springboot/primary/react-generator';
import { VueGeneratorVue } from '@/springboot/primary/vue-generator';
import { SvelteGeneratorVue } from '@/springboot/primary/svelte-generator';
import { SpringBootGeneratorVue } from '@/springboot/primary/spring-boot-generator';

export default defineComponent({
  name: 'GeneratorComponent',
  components: {
    SpringBootGeneratorVue,
    AngularGeneratorVue,
    ReactGeneratorVue,
    SvelteGeneratorVue,
    VueGeneratorVue,
  },
  setup() {
    const logger = inject('logger') as Logger;
    const projectService = inject('projectService') as ProjectService;

    const selectorPrefix = 'generator';

    const project = ref<ProjectToUpdate>({
      folder: '',
    });
    const language = ref<string>();
    const buildTool = ref<string>('maven');
    const server = ref<string>();
    const client = ref<string>();

    const initProject = async (): Promise<void> => {
      if (project.value.folder !== '') {
        await projectService.init(toProject(project.value)).catch(error => logger.error('Project initialization failed', error.message));
      }
    };

    const addMaven = async (): Promise<void> => {
      if (project.value.folder !== '') {
        await projectService.addMaven(toProject(project.value)).catch(error => logger.error('Adding Maven to project failed', error));
      }
    };

    const addJaCoCo = async (): Promise<void> => {
      if (project.value.folder !== '') {
        await projectService.addJaCoCo(toProject(project.value)).catch(error => logger.error('Adding JaCoCo to project failed', error));
      }
    };

    const addSonarBackend = async (): Promise<void> => {
      if (project.value.folder !== '') {
        await projectService
          .addSonarBackend(toProject(project.value))
          .catch(error => logger.error('Adding Sonar Backend to project failed', error));
      }
    };

    const addSonarBackendFrontend = async (): Promise<void> => {
      if (project.value.folder !== '') {
        await projectService
          .addSonarBackendFrontend(toProject(project.value))
          .catch(error => logger.error('Adding Sonar Backend+Frontend to project failed', error));
      }
    };

    const addJavaBase = async (): Promise<void> => {
      if (project.value.folder !== '') {
        await projectService
          .addJavaBase(toProject(project.value))
          .catch(error => logger.error('Adding Java Base to project failed', error));
      }
    };

    const addFrontendMavenPlugin = async (): Promise<void> => {
      if (project.value.folder !== '') {
        await projectService
          .addFrontendMavenPlugin(toProject(project.value))
          .catch(error => logger.error('Adding Frontend Maven Plugin to project failed', error));
      }
    };

    const download = async (): Promise<void> => {
      await projectService
        .download(toProject(project.value))
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response], { type: 'application/zip' }));
          const link = document.createElement('a');
          link.href = url;
          const zipName = project.value.baseName || 'application';
          link.setAttribute('download', zipName + '.zip');
          document.body.appendChild(link);
          link.click();
        })
        .catch(error => logger.error('Downloading project failed', error));
    };

    return {
      project,
      language,
      buildTool,
      server,
      client,
      initProject,
      addMaven,
      addJaCoCo,
      addSonarBackend,
      addSonarBackendFrontend,
      addJavaBase,
      addFrontendMavenPlugin,
      download,
      selectorPrefix,
    };
  },
});
